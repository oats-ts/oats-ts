import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getValidatorAst(
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
) {
  const { nameOf } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(schema, 'openapi/validator'),
          undefined,
          undefined,
          getRightHandSideValidatorAst(schema, context, config, 0),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
