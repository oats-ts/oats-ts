import { tsArrayType } from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getArrayTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext) {
  return tsArrayType(getTypeReferenceAst(data.items, context))
}
