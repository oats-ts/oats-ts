import { TypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getJsonLiteralTypeAst } from './getJsonLiteralTypeAst'
import { JsonSchemaGeneratorContext } from '../types'

export function getConstantTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext): TypeNode {
  return getJsonLiteralTypeAst(data.const)
}
