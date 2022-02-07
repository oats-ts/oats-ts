import { factory, UnionTypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getLiteralUnionTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode(data.enum.map((value) => factory.createLiteralTypeNode(getLiteralAst(value))))
}
