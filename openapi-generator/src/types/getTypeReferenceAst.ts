import { isNil } from 'lodash'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'

export function getTypeReferenceAst(data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext) {
  const { accessor } = context
  const schema = isNil(data) ? null : accessor.dereference(data)
  if (isNil(schema)) {
    return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
  }
  const name = accessor.name(schema, 'type')
  if (isNil(name)) {
    return getRighthandSideTypeAst(schema, context)
  }
  return factory.createTypeReferenceNode(name)
}
