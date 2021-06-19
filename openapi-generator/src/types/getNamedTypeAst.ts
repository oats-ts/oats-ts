import { ExportNamedDeclaration, exportNamedDeclaration, identifier, tsTypeAliasDeclaration } from '@babel/types'
import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'

export function getNamedTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): ExportNamedDeclaration {
  const { accessor } = context
  if (!isNil(data.enum)) {
    return getNamedEnumAst(data, context)
  }

  return exportNamedDeclaration(
    tsTypeAliasDeclaration(identifier(accessor.name(data, 'type')), undefined, getRighthandSideTypeAst(data, context)),
  )
}
