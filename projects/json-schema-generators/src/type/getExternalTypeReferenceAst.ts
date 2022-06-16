import { isNil } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory } from 'typescript'
import { TypesGeneratorConfig } from './typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getExternalTypeReferenceAst(
  data: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { nameOf } = context
  const typeName = nameOf(data, 'json-schema/type')
  return isNil(typeName) ? getTypeReferenceAst(data, context, config) : factory.createTypeReferenceNode(typeName)
}
