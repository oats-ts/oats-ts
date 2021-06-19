import { SchemaObject } from 'openapi3-ts'
import { factory, NodeFlags, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getValidatorAst(schema: SchemaObject, context: OpenAPIGeneratorContext, references: boolean) {
  const { accessor } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
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
