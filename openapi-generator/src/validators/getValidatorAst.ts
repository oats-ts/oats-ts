import { SchemaObject } from 'openapi3-ts'
import { factory, NodeFlags } from 'typescript'
import { tsExportModifier } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getValidatorAst(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
) {
  const { accessor } = context
  return factory.createVariableStatement(
    [tsExportModifier()],
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
