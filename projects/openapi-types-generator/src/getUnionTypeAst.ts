import { SchemaObject } from 'openapi3-ts'
import { factory, UnionTypeNode } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getUnionTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): UnionTypeNode {
  return factory.createUnionTypeNode(data.oneOf.map((type) => getTypeReferenceAst(type, context, config)))
}
