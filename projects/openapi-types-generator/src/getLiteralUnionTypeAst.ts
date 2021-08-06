import { factory, UnionTypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getLiteralAst } from '@oats-ts/typescript-common'

export function getLiteralUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode(data.enum.map((value) => factory.createLiteralTypeNode(getLiteralAst(value))))
}
