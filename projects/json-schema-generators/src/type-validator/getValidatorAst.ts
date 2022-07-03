import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getValidatorAst(
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
) {
  const { nameOf } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(schema, 'json-schema/type-validator'),
          undefined,
          undefined,
          getRightHandSideValidatorAst(schema, context, config),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
