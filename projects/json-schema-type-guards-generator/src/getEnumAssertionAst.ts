import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { FullTypeGuardGeneratorConfig } from './typings'
import { getLiteralAst, getLogicalExpression } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getEnumAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
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
