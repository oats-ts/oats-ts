import { factory, SyntaxKind } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getArrayTypeAst(data: SchemaObject, context: JsonSchemaGeneratorContext, config: TypesGeneratorConfig) {
  if (typeof data.items === 'boolean') {
    return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
  }
  return factory.createArrayTypeNode(getTypeReferenceAst(data.items, context, config))
}
