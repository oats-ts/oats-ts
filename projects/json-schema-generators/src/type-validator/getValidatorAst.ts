import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getValidatorAst(
  schema: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
) {
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          context.nameOf(schema, 'oats/type-validator'),
          undefined,
          undefined,
          getRightHandSideValidatorAst(schema, context, config, helper),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
