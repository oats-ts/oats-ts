import { factory, UnionTypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { getJsonLiteralTypeAst } from './getJsonLiteralTypeAst'

export function getLiteralUnionTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode(data.enum.map((value) => getJsonLiteralTypeAst(value)))
}
