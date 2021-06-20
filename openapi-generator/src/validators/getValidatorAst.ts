import { SchemaObject } from 'openapi3-ts'
import { factory, NodeFlags } from 'typescript'
import { tsExportModifier } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getValidatorAst(schema: SchemaObject, context: OpenAPIGeneratorContext, references: boolean) {
  const { accessor } = context
  return factory.createVariableStatement(
    [tsExportModifier()],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          accessor.name(schema, 'validator'),
          undefined,
          undefined,
          getRightHandSideValidatorAst(schema, context, references),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
