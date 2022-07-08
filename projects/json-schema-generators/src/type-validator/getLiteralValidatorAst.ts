import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression } from 'typescript'
import { getJsonLiteralValidatorAst } from './getJsonLiteralValidatorAst'

export function getLiteralValidatorAst(data: SchemaObject): Expression {
  return getJsonLiteralValidatorAst(data.const)
}
