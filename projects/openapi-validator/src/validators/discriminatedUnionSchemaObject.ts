import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { entries, isNil, flatMap } from 'lodash'
import { objectSchemaObject } from './objectSchemaObject'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { getInferredType } from '@oats-ts/model-common'
import { structural } from '../structural'

export function discriminatedUnionSchemaObject(
  data: SchemaObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const name = context.nameOf(data)
    if (isNil(name)) {
      return [
        {
          message: `only named schemas can have the "discriminator" field`,
          path: context.uriOf(data),
          severity: 'error',
        },
      ]
    }

    const { discriminator, oneOf } = data
    const discriminatorValues = entries(discriminator?.mapping ?? {})
    const oneOfRefs = (oneOf || []) as ReferenceObject[]

    return ordered(() => structural.discriminatedUnionSchemaObject(data, context.uriOf(data), validatorConfig))(
      () =>
        oneOfRefs
          .filter((ref) => !discriminatorValues.some(([, refTarget]) => ref.$ref === refTarget))
          .map(
            (ref): Issue => ({
              message: `"discriminator" is missing "${ref.$ref}"`,
              path: context.uriOf(discriminator),
              severity: 'error',
            }),
          ),
      () =>
        discriminatorValues
          .filter(([, refTarget]) => !oneOfRefs.some((ref) => ref.$ref === refTarget))
          .map(
            ([prop, ref]): Issue => ({
              message: `"${prop}" referencing "${ref}" in "discriminator" has no counterpart in "oneOf"`,
              path: context.uriOf(discriminator),
              severity: 'error',
            }),
          ),
      () =>
        flatMap(oneOf, (ref): Issue[] => {
          // TODO validating refs here is a pain, need a different solution
          const schema = context.dereference(ref)
          switch (getInferredType(schema)) {
            case 'object':
              return objectSchemaObject()(schema, context, config)
            case 'union':
              return discriminatedUnionSchemaObject(schema, context, config)
            default:
              return [
                {
                  message: `should reference either an "object" schema or another schema with "discriminator"`,
                  path: context.uriOf(ref),
                  severity: 'error',
                },
              ]
          }
        }),
    )
  })
}
