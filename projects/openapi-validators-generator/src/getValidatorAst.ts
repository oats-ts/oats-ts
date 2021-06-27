import { SchemaObject } from 'openapi3-ts'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getValidatorAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
) {
  const { accessor } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          accessor.name(schema, 'validator'),
          undefined,
          undefined,
          getRightHandSideValidatorAst(schema, context, config),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
