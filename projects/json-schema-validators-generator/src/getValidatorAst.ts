import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig, ValidatorsGeneratorContext } from './typings'

export function getValidatorAst(
  schema: SchemaObject | ReferenceObject,
  context: ValidatorsGeneratorContext,
  config: ValidatorsGeneratorConfig,
) {
  const { nameOf } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(schema, context.produces),
          undefined,
          undefined,
          getRightHandSideValidatorAst(schema, context, config, 0),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
