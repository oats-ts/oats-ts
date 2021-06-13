import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  tsEnumDeclaration,
  tsEnumMember,
} from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { nameAst } from '../../babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { getLiteralTypeAst } from './getLiteralTypeAst'

export function getNamedEnumAst(input: SchemaObject, context: OpenAPIGeneratorContext): ExportNamedDeclaration {
  const { accessor } = context
  return exportNamedDeclaration(
    tsEnumDeclaration(
      identifier(accessor.name(input, 'type')),
      input.enum.map((value) => {
        return tsEnumMember(nameAst(value.toString()), getLiteralTypeAst(value))
      }),
    ),
  )
}
