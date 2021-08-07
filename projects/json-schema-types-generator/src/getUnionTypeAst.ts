import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, UnionTypeNode } from 'typescript'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'

export function getUnionTypeAst(
  data: SchemaObject,
  context: TypesGeneratorContext,
  config: TypesGeneratorConfig,
): UnionTypeNode {
  return factory.createUnionTypeNode(data.oneOf.map((type) => getTypeReferenceAst(type, context, config)))
}
