import { factory, SyntaxKind } from 'typescript'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getDictionaryTypeAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { accessor } = context
  const { additionalProperties } = accessor.dereference(data)
  const schema = typeof additionalProperties === 'boolean' ? null : additionalProperties
  return factory.createTypeReferenceNode(factory.createIdentifier('Record'), [
    factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
    getTypeReferenceAst(schema, context, config),
  ])
}
