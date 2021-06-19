import { SchemaObject } from 'openapi3-ts'
import { factory, TypeLiteralNode } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getObjectPropertiesAst } from './getObjectPropertiesAst'

export function getObjectTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TypeLiteralNode {
  return factory.createTypeLiteralNode(getObjectPropertiesAst(data, context))
}
