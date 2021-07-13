import { isNil } from 'lodash'
import { SchemaObject, ReferenceObject, isReferenceObject } from 'openapi3-ts'
import { EnumDeclaration, factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { getInferredType, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'
import { documentNode } from '@oats-ts/typescript-common'

export function getNamedTypeAst(
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): TypeAliasDeclaration | EnumDeclaration {
  const { nameOf } = context
  if (isReferenceObject(schema) || getInferredType(schema) !== 'enum') {
    const node = factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createIdentifier(nameOf(schema, 'openapi/type')),
      undefined,
      getRighthandSideTypeAst(schema, context, config),
    )

    return config.documentation && !isReferenceObject(schema) ? documentNode(node, schema) : node
  }

  if (!isNil(schema.enum) && config.enums) {
    return getNamedEnumAst(schema, context)
  }
}
