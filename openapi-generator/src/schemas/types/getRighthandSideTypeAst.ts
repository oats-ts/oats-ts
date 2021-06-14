import {
  tsAnyKeyword,
  tsBooleanKeyword,
  tsNumberKeyword,
  tsStringKeyword,
  TSType,
  tsUndefinedKeyword,
} from '@babel/types'
import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { getArrayTypeAst } from './getArrayTypeAst'
import { getDictionaryTypeAst } from './getDictionaryTypeAst'
import { getLiteralUnionTypeAst } from './getLiteralUnionTypeAst'
import { getObjectTypeAst } from './getObjectTypeAst'
import { getUnionTypeAst } from './getUnionTypeAst'

export function getRighthandSideTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSType {
  if (!isNil(data.oneOf)) {
    return getUnionTypeAst(data, context)
  }

  if (!isNil(data.enum)) {
    return getLiteralUnionTypeAst(data, context)
  }

  if (data.type === 'string') {
    return tsStringKeyword()
  }

  if (data.type === 'number' || data.type === 'integer') {
    return tsNumberKeyword()
  }

  if (data.type === 'boolean') {
    return tsBooleanKeyword()
  }

  if (!isNil(data.additionalProperties)) {
    return getDictionaryTypeAst(data, context)
  }

  if (!isNil(data.properties)) {
    return getObjectTypeAst(data, context)
  }

  if (!isNil(data.items)) {
    return getArrayTypeAst(data, context)
  }

  return tsAnyKeyword()
}
