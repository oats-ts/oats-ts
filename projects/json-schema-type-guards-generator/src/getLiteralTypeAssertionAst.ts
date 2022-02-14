import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression } from 'typescript'
import { FullTypeGuardGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { getJsonLiteralAssertionAst } from './getJsonLiteralAssertionAst'

export function getLiteralTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  return getJsonLiteralAssertionAst(data.const, variable)
}
