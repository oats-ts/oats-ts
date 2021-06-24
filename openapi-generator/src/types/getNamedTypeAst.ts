import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { EnumDeclaration, factory, TypeAliasDeclaration } from 'typescript'
import { documentType } from '../common/jsDoc'
import { tsExportModifier } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'

export function getNamedTypeAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeAliasDeclaration | EnumDeclaration {
  const { accessor } = context
  if (!isNil(schema.enum) && config.enums) {
    return getNamedEnumAst(schema, context)
  }

  return documentType(
    factory.createTypeAliasDeclaration(
      undefined,
      [tsExportModifier()],
      factory.createIdentifier(accessor.name(schema, 'type')),
      undefined,
      getRighthandSideTypeAst(schema, context, config),
    ),
    schema,
    config,
  )
}
