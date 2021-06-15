import { tsLiteralType, tsUnionType, TSUnionType } from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { getLiteralAst } from './getLiteralTypeAst'

export function getLiteralUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSUnionType {
  return tsUnionType(data.enum.map((value) => tsLiteralType(getLiteralAst(value))))
}
