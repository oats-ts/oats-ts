import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { tsBinaryExpressions } from '../common/typeScriptUtils'
import { getLiteralAst } from '../types/getLiteralAst'
import { OpenAPIGeneratorContext } from '../typings'
import { FullTypeGuardGeneratorConfig } from './typings'

export function getEnumAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  return tsBinaryExpressions(
    SyntaxKind.BarBarToken,
    data.enum.map((value) =>
      factory.createBinaryExpression(variable, SyntaxKind.EqualsEqualsEqualsToken, getLiteralAst(value)),
    ),
  )
}
