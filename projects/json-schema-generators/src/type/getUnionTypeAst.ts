import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, UnionTypeNode } from 'typescript'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getUnionTypeAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
): UnionTypeNode {
  return factory.createUnionTypeNode(data.oneOf.map((type) => getTypeReferenceAst(type, context, config)))
}
