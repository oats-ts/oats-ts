import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, SyntaxKind } from 'typescript'
import { TypeGuardGeneratorConfig } from './typings'
import { getLogicalExpression } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { getJsonLiteralAssertionAst } from './getJsonLiteralAssertionAst'

export function getEnumAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
): Expression {
  return getLogicalExpression(
    SyntaxKind.BarBarToken,
    data.enum.map((value) => getJsonLiteralAssertionAst(value, variable)),
  )
}
