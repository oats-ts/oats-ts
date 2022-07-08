import { SchemaObject, DiscriminatorObject, ReferenceObject } from '@oats-ts/json-schema-model'
import {
  Issue,
  object,
  optional,
  shape,
  combine,
  array,
  items,
  string,
  literal,
  record,
  minLength,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { entries, isNil, flatMap } from 'lodash'
import { objectSchemaObject } from './objectSchemaObject'
import { ordered } from '../utils/ordered'
import { ignore } from '../utils/ignore'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { getInferredType } from '@oats-ts/model-common'

const validator = object(
  combine(
    shape<SchemaObject>(
      {
        type: optional(literal('object')),
        discriminator: object(
          shape<DiscriminatorObject>({
            propertyName: string(),
            mapping: object(record(string(), string())),
          }),
        ),
        oneOf: array(
          combine(
            items(
              object(
                shape<ReferenceObject>({
                  $ref: string(),
                }),
              ),
            ),
            minLength(1),
          ),
        ),
      },
      true,
    ),
    ignore(['allOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'enum']),
  ),
)
export function discriminatedUnionSchemaObject(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { nameOf, uriOf, dereference } = context
    const name = nameOf(data)
    if (isNil(name)) {
      return [
        {
          message: `only named schemas can have the "discriminator" field`,
          path: uriOf(data),
          type: 'other',
          severity: 'error',
        },
      ]
    }

    const { discriminator, oneOf } = data
    const discriminatorValues = entries(discriminator.mapping || {})
    const oneOfRefs = (oneOf || []) as ReferenceObject[]

    return ordered(() => validator(data, uriOf(data), validatorConfig))(
      () =>
        oneOfRefs
          .filter((ref) => !discriminatorValues.some(([, refTarget]) => ref.$ref === refTarget))
          .map(
            (ref): Issue => ({
              message: `"discriminator" is missing "${ref.$ref}"`,
              path: uriOf(discriminator),
              severity: 'error',
              type: 'other',
            }),
          ),
      () =>
        discriminatorValues
          .filter(([, refTarget]) => !oneOfRefs.some((ref) => ref.$ref === refTarget))
          .map(
            ([prop, ref]): Issue => ({
              message: `"${prop}" referencing "${ref}" in "discriminator" has no counterpart in "oneOf"`,
              path: uriOf(discriminator),
              severity: 'error',
              type: 'other',
            }),
          ),
      () =>
        flatMap(oneOf, (ref): Issue[] => {
          // TODO validating refs here is a pain, need a different solution
          const schema = dereference(ref)
          switch (getInferredType(schema)) {
            case 'object':
              return objectSchemaObject()(schema, context, config)
            case 'union':
              return discriminatedUnionSchemaObject(schema, context, config)
            default:
              return [
                {
                  message: `should reference either an "object" schema or another schema with "discriminator"`,
                  path: uriOf(ref),
                  severity: 'error',
                  type: 'other',
                },
              ]
          }
        }),
    )
  })
}
