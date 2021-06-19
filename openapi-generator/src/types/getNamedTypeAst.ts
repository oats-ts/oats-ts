import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { EnumDeclaration, factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'

export function getNamedTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
): TypeAliasDeclaration | EnumDeclaration {
  const { accessor } = context
  if (!isNil(data.enum)) {
    return getNamedEnumAst(data, context)
  }

  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(accessor.name(data, 'type')),
    undefined,
    getRighthandSideTypeAst(data, context),
  )
}
