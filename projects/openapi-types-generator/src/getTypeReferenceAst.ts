import { isNil } from 'lodash'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'

export function getTypeReferenceAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { dereference, nameOf } = context
  const schema = isNil(data) ? null : dereference(data)
  if (isNil(schema)) {
    return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
  }
  const name = nameOf(schema, 'openapi/type')
  if (isNil(name)) {
    return getRighthandSideTypeAst(schema, context, config)
  }
  return factory.createTypeReferenceNode(name)
}
