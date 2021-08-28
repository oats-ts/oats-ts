import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { FullTypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { getLiteralAst, getLogicalExpression } from '@oats-ts/typescript-common'

export function getEnumAssertionAst(
  data: SchemaObject,
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  return getLogicalExpression(
    SyntaxKind.BarBarToken,
    data.enum.map((value) =>
      factory.createBinaryExpression(variable, SyntaxKind.EqualsEqualsEqualsToken, getLiteralAst(value)),
    ),
  )
}
