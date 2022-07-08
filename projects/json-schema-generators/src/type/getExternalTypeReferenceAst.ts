import { isNil } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory } from 'typescript'
import { TypesGeneratorConfig } from './typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { JsonSchemaGeneratorContext } from '../types'

export function getExternalTypeReferenceAst(
  data: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { nameOf } = context
  const typeName = nameOf(data)
  return isNil(typeName) ? getTypeReferenceAst(data, context, config) : factory.createTypeReferenceNode(typeName)
}
