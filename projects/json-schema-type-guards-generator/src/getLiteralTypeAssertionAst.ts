import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { FullTypeGuardGeneratorConfig } from './typings'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getLiteralTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  return factory.createBinaryExpression(variable, SyntaxKind.EqualsEqualsEqualsToken, getLiteralAst(data.const))
}
