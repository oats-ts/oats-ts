import { factory, SyntaxKind } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getDictionaryTypeAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { additionalProperties } = data
  const schema = typeof additionalProperties === 'boolean' ? null : additionalProperties
  return factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    getTypeReferenceAst(schema, context, config),
  ])
}
