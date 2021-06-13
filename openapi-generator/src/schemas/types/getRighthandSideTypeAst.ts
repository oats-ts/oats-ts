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

  switch (data.type) {
    case 'string':
      return tsStringKeyword()
    case 'number':
    case 'integer':
      return tsNumberKeyword()
    case 'boolean':
      return tsBooleanKeyword()
    case 'object':
      if (!isNil(data.additionalProperties)) {
        return getDictionaryTypeAst(data, context)
      }
      return getObjectTypeAst(data, context)
    case 'array':
      return getArrayTypeAst(data, context)
    case 'null':
      return tsUndefinedKeyword()
    default:
      return tsAnyKeyword()
  }
}
