import { SchemaObject, DiscriminatorObject, ReferenceObject } from 'openapi3-ts'
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
import { OpenAPIGeneratorContext, getInferredType } from '@oats-ts/openapi-common'
import { append } from '../append'
import { entries, isNil, flatMap } from 'lodash'
import { validateObject } from './validateObject'
import { ordered } from '../ordered'
import { ignore } from '../ignore'

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
export function validateDiscriminatedUnion(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  const { dereference, nameOf, uriOf } = context
  const schema = dereference(data)
  if (validated.has(schema)) {
    return []
  }
  validated.add(schema)
  const name = nameOf(schema, 'openapi/type')
  if (isNil(name)) {
    return [
      {
        message: `only named schemas can have the "discriminator" field`,
        path: uriOf(schema),
        type: 'other',
        severity: 'error',
      },
    ]
  }

  const { discriminator, oneOf } = schema
  const discriminatorValues = entries(discriminator.mapping || {})
  const oneOfRefs = (oneOf || []) as ReferenceObject[]

  return ordered(() =>
    validator(schema, {
      append,
      path: uriOf(schema),
    }),
  )(
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
        const schema = dereference(ref)
        switch (getInferredType(schema)) {
          case 'object':
            return validateObject()(schema, context, validated)
          case 'union':
            return validateDiscriminatedUnion(schema, context, validated)
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
}
