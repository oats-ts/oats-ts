import { SchemaObject, Referenceable } from '@oats-ts/json-schema-model'
import { EnumDeclaration, factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'
import { documentNode } from '@oats-ts/typescript-common'
import { isReferenceObject } from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext } from '../types'

export function getNamedTypeAst(
  schema: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
): TypeAliasDeclaration | EnumDeclaration {
  const { nameOf } = context

  const node = factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(nameOf(schema, 'json-schema/type')),
    undefined,
    getRighthandSideTypeAst(schema, context, config),
  )

  return config.documentation && !isReferenceObject(schema) ? documentNode(node, schema) : node
}
