import { tsUnionType, TSUnionType } from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSUnionType {
  return tsUnionType(data.oneOf.map((type) => getTypeReferenceAst(type, context)))
}
