import { factory, UnionTypeNode } from 'typescript'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getLiteralAst } from './getLiteralAst'

export function getLiteralUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode(data.enum.map((value) => factory.createLiteralTypeNode(getLiteralAst(value))))
}
