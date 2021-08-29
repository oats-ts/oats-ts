import { isNil } from 'lodash'
import { SchemaObject, Referenceable } from '@oats-ts/json-schema-model'
import { getInferredType, isReferenceObject } from '@oats-ts/json-schema-common'
import { EnumDeclaration, factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { getNamedEnumAst } from './getNamedEnumAst'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
import { documentNode } from '@oats-ts/typescript-common'

export function getNamedTypeAst(
  schema: Referenceable<SchemaObject>,
  context: TypesGeneratorContext,
  config: TypesGeneratorConfig,
): TypeAliasDeclaration | EnumDeclaration {
  const { nameOf, target } = context
  if (getInferredType(schema) === 'enum' && config.enums) {
    const node = getNamedEnumAst(schema as SchemaObject, context)
    return config.documentation ? documentNode(node, schema as SchemaObject) : node
  }

  const node = factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(nameOf(schema, target)),
    undefined,
    getRighthandSideTypeAst(schema, context, config),
  )

  return config.documentation && !isReferenceObject(schema) ? documentNode(node, schema) : node
}
