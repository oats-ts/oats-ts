import { factory } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getArrayTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext, config: TypesGeneratorConfig) {
  return factory.createArrayTypeNode(getTypeReferenceAst(data.items, context, config))
}
