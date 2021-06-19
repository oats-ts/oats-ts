import { SchemaObject } from 'openapi3-ts'
import { factory, UnionTypeNode } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode(data.oneOf.map((type) => getTypeReferenceAst(type, context)))
}
