import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, TypeLiteralNode } from 'typescript'
import { JsonSchemaGeneratorContext } from '../types'
import { getObjectPropertiesAst } from './getObjectPropertiesAst'
import { TypesGeneratorConfig } from './typings'

export function getObjectTypeAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
): TypeLiteralNode {
  return factory.createTypeLiteralNode(getObjectPropertiesAst(data, context, config))
}
