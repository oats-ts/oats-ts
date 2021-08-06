import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, TypeLiteralNode } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getObjectPropertiesAst } from './getObjectPropertiesAst'
import { TypesGeneratorConfig } from './typings'

export function getObjectTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeLiteralNode {
  return factory.createTypeLiteralNode(getObjectPropertiesAst(data, context, config))
}
