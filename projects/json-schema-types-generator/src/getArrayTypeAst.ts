import { factory } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'

export function getArrayTypeAst(data: SchemaObject, context: TypesGeneratorContext, config: TypesGeneratorConfig) {
  return factory.createArrayTypeNode(getTypeReferenceAst(data.items, context, config))
}
