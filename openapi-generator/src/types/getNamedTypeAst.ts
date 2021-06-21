import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { EnumDeclaration, factory, TypeAliasDeclaration } from 'typescript'
import { tsExportModifier } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'

export function getNamedTypeAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeAliasDeclaration | EnumDeclaration {
  const { accessor } = context
  if (!isNil(data.enum) && config.enums) {
    return getNamedEnumAst(data, context)
  }

  return factory.createTypeAliasDeclaration(
    undefined,
    [tsExportModifier()],
    factory.createIdentifier(accessor.name(data, 'type')),
    undefined,
    getRighthandSideTypeAst(data, context),
  )
}
