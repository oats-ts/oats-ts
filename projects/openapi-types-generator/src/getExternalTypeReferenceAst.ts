import { isNil } from 'lodash'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypesGeneratorConfig } from './typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getExternalTypeReferenceAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { nameOf } = context
  const typeName = nameOf(data, 'openapi/type')
  return isNil(typeName) ? getTypeReferenceAst(data, context, config) : factory.createTypeReferenceNode(typeName)
}
