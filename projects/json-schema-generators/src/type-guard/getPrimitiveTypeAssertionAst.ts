import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getPrimitiveType } from '@oats-ts/model-common'
import { TypeGuardGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '../types'

export function getPrimitiveTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
): Expression {
  return factory.createBinaryExpression(
    factory.createTypeOfExpression(variable),
    SyntaxKind.EqualsEqualsEqualsToken,
    factory.createStringLiteral(getPrimitiveType(data)!),
  )
}
