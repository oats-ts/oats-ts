import { factory, SyntaxKind } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getDictionaryTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { additionalProperties } = data
  const schema = typeof additionalProperties === 'boolean' ? null : additionalProperties
  return factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    getTypeReferenceAst(schema, context, config),
  ])
}
