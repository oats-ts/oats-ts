import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression } from 'typescript'
import { TypeGuardGeneratorConfig } from './typings'
import { getJsonLiteralAssertionAst } from './getJsonLiteralAssertionAst'
import { JsonSchemaGeneratorContext } from '../types'

export function getLiteralTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
): Expression {
  return getJsonLiteralAssertionAst(data.const, variable)
}
