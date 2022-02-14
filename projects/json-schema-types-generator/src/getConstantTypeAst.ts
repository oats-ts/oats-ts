import { TypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { getJsonLiteralTypeAst } from './getJsonLiteralTypeAst'

export function getConstantTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext): TypeNode {
  return getJsonLiteralTypeAst(data.const)
}
