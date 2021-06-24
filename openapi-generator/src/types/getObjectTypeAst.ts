import { SchemaObject } from 'openapi3-ts'
import { factory, TypeLiteralNode } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getObjectPropertiesAst } from './getObjectPropertiesAst'
import { TypesGeneratorConfig } from './typings'

export function getObjectTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeLiteralNode {
  return factory.createTypeLiteralNode(getObjectPropertiesAst(data, context, config))
}
