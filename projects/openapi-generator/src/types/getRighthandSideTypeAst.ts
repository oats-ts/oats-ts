import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, SyntaxKind, TypeNode } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getArrayTypeAst } from './getArrayTypeAst'
import { getDictionaryTypeAst } from './getDictionaryTypeAst'
import { getLiteralUnionTypeAst } from './getLiteralUnionTypeAst'
import { getObjectTypeAst } from './getObjectTypeAst'
import { getUnionTypeAst } from './getUnionTypeAst'
import { TypesGeneratorConfig } from './typings'

export function getRighthandSideTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeNode {
  if (!isNil(data.oneOf)) {
    return getUnionTypeAst(data, context, config)
  }

  if (!isNil(data.enum)) {
    return getLiteralUnionTypeAst(data, context)
  }

  if (data.type === 'string') {
    return factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
  }

  if (data.type === 'number' || data.type === 'integer') {
    return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword)
  }

  if (data.type === 'boolean') {
    return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
  }

  if (!isNil(data.additionalProperties)) {
    return getDictionaryTypeAst(data, context, config)
  }

  if (!isNil(data.properties)) {
    return getObjectTypeAst(data, context, config)
  }

  if (!isNil(data.items)) {
    return getArrayTypeAst(data, context, config)
  }

  return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
}
