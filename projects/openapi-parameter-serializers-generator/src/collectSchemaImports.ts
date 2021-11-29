import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate } from 'lodash'

export function collectSchemaImports(
  path: string,
  params: Referenceable<BaseParameterObject>[],
  context: OpenAPIGeneratorContext,
) {
  const { dereference, dependenciesOf } = context
  const schemas = params
    .map((parameter) => dereference(parameter, true))
    .map((parameter) => parameter?.schema)
    .filter(negate(isNil))
  return flatMap(schemas, (schema) => dependenciesOf(path, schema, 'openapi/type'))
}
