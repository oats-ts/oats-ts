import { factory, UnionTypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getJsonLiteralTypeAst } from './getJsonLiteralTypeAst'
import { JsonSchemaGeneratorContext } from '../types'

export function getLiteralUnionTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext): UnionTypeNode {
  return factory.createUnionTypeNode((data.enum ?? []).map((value) => getJsonLiteralTypeAst(value)))
}
