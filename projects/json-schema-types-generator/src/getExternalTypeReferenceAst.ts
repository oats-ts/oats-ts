import { isNil } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory } from 'typescript'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getExternalTypeReferenceAst(
  data: Referenceable<SchemaObject>,
  context: TypesGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { nameOf, target } = context
  const typeName = nameOf(data, target)
  return isNil(typeName) ? getTypeReferenceAst(data, context, config) : factory.createTypeReferenceNode(typeName)
}
