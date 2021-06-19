import { tsTypeLiteral, TSTypeLiteral } from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getObjectPropertiesAst } from './getObjectPropertiesAst'

export function getObjectTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSTypeLiteral {
  return tsTypeLiteral(getObjectPropertiesAst(data, context))
}
