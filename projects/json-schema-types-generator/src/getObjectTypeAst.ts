import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, TypeLiteralNode } from 'typescript'
import { getObjectPropertiesAst } from './getObjectPropertiesAst'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'

export function getObjectTypeAst(
  data: SchemaObject,
  context: TypesGeneratorContext,
  config: TypesGeneratorConfig,
): TypeLiteralNode {
  return factory.createTypeLiteralNode(getObjectPropertiesAst(data, context, config))
}
