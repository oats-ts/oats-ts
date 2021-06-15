import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  tsEnumDeclaration,
  tsEnumMember,
} from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { idAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { getLiteralAst } from './getLiteralTypeAst'

export function getNamedEnumAst(input: SchemaObject, context: OpenAPIGeneratorContext): ExportNamedDeclaration {
  const { accessor } = context
  return exportNamedDeclaration(
    tsEnumDeclaration(
      identifier(accessor.name(input, 'type')),
      input.enum.map((value) => {
        return tsEnumMember(idAst(value.toString()), getLiteralAst(value))
      }),
    ),
  )
}
