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
import { forbidFields } from './forbidFields'
import { append } from './utils'
import { entries, isNil, flatMap } from 'lodash'
import { validateObject } from './validateObject'

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
    forbidFields(['allOf', 'anyOf', 'not', 'items', 'properties', 'additionalProperties', 'enum']),
  ),
)
export function validateDiscriminatedUnion(
  input: SchemaObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  const { accessor } = context
  if (validated.has(input)) {
    return []
  }
  validated.add(input)
  const name = accessor.name(input, 'openapi/type')
  if (isNil(name)) {
    return [
      {
        message: `only named schemas can have the "discriminator" field`,
        path: accessor.uri(input),
        type: 'other',
        severity: 'error',
      },
    ]
  }

  const structureIssues = validator(input, { append, path: accessor.uri(input) })
  if (structureIssues) {
    return structureIssues
  }

  const { discriminator, oneOf } = input
  const discriminatorValues = entries(discriminator.mapping)
  const oneOfRefs = oneOf as ReferenceObject[]
  const missingDiscriminatorIssues = oneOfRefs
    .filter((ref) => !discriminatorValues.some(([, refTarget]) => ref.$ref === refTarget))
    .map(
      (ref): Issue => ({
        message: `"discriminator" is missing "${ref.$ref}"`,
        path: accessor.uri(discriminator),
        severity: 'error',
        type: 'other',
      }),
    )
  const extraDiscriminatorIssues = discriminatorValues
    .filter(([, refTarget]) => !oneOfRefs.some((ref) => ref.$ref === refTarget))
    .map(
      ([prop]): Issue => ({
        message: `"${prop}" in "discriminator" has no counterpart in "oneOf"`,
        path: accessor.uri(discriminator),
        severity: 'error',
        type: 'other',
      }),
    )

  const childIssues = flatMap(oneOf, (ref): Issue[] => {
    const schema = accessor.dereference(ref)
    switch (getInferredType(schema)) {
      case 'object':
        return validateObject(schema, context, validated)
      case 'union':
        return validateDiscriminatedUnion(schema, context, validated)
      default:
        return [
          {
            message: `should reference either an "object" schema or another schema with "discriminator"`,
            path: accessor.uri(ref),
            severity: 'error',
            type: 'other',
          },
        ]
    }
  })

  return [...missingDiscriminatorIssues, ...extraDiscriminatorIssues, ...childIssues]
}
