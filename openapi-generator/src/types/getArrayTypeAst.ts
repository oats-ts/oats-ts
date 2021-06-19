import { factory } from 'typescript'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getArrayTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext) {
  return factory.createArrayTypeNode(getTypeReferenceAst(data.items, context))
}
