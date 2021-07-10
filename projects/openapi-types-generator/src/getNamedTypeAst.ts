import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { EnumDeclaration, factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'
import { documentNode } from '@oats-ts/typescript-common'

export function getNamedTypeAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeAliasDeclaration | EnumDeclaration {
  const { nameOf } = context
  if (!isNil(schema.enum) && config.enums) {
    return getNamedEnumAst(schema, context)
  }
  const node = factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(nameOf(schema, 'openapi/type')),
    undefined,
    getRighthandSideTypeAst(schema, context, config),
  )

  return config.documentation ? documentNode(node, schema) : node
}
