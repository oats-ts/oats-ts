import { getInferredType } from '@oats-ts/json-schema-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getParameterKind, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate, values } from 'lodash'

function recCollectNamedSchemas(
  input: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  references: Set<Referenceable<SchemaObject>>,
): void {
  const { dereference } = context
  const schema = dereference<SchemaObject>(input, true)
  const kind = getParameterKind(schema)
  const inferredType = getInferredType(schema)
  switch (kind) {
    case 'object':
      references.add(input)
      values(schema.properties || {}).forEach((property) => recCollectNamedSchemas(property, context, references))
      return
    case 'array':
      if (!isNil(schema.items)) {
        references.add(schema.items)
      }
      recCollectNamedSchemas(schema.items, context, references)
      return
    case 'primitive':
      if (inferredType === 'enum') {
        references.add(input)
      }
  }
}

function collectNamedSchemas(input: Referenceable<SchemaObject>, context: OpenAPIGeneratorContext) {
  const refs = new Set<Referenceable<SchemaObject>>()
  recCollectNamedSchemas(input, context, refs)
  return Array.from(refs)
}

export function collectSchemaImports(
  path: string,
  params: Referenceable<BaseParameterObject>[],
  context: OpenAPIGeneratorContext,
) {
  const { dereference, dependenciesOf } = context
  const schemas = flatMap(
    params
      .map((parameter) => dereference(parameter, true))
      .map((parameter) => parameter?.schema)
      .filter(negate(isNil)),
    (schema) => collectNamedSchemas(schema, context),
  )
  return flatMap(schemas, (schema) => dependenciesOf(path, schema, 'openapi/type'))
}
