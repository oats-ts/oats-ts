import { factory, TypeNode } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getConstantTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext): TypeNode {
  return factory.createLiteralTypeNode(getLiteralAst(data.const))
}
