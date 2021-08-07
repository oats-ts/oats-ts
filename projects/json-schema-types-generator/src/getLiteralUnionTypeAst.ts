import { factory, UnionTypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { TypesGeneratorContext } from './typings'

export function getLiteralUnionTypeAst(data: SchemaObject, context: TypesGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode(data.enum.map((value) => factory.createLiteralTypeNode(getLiteralAst(value))))
}
