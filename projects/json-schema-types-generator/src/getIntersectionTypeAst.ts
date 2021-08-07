import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, TypeNode, SyntaxKind } from 'typescript'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'

export function getIntersectionTypeAst(
  data: SchemaObject,
  context: TypesGeneratorContext,
  config: TypesGeneratorConfig,
): TypeNode {
  const types = data.allOf
    .map((type) => getTypeReferenceAst(type, context, config))
    .filter((ast) => ast.kind !== SyntaxKind.AnyKeyword)
  return types.length > 0
    ? factory.createIntersectionTypeNode(types)
    : factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
}
