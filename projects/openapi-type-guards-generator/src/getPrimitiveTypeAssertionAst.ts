import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getPrimitiveType } from '@oats-ts/model-common'
import { FullTypeGuardGeneratorConfig } from './typings'
import {} from '@oats-ts/typescript-common'

export function getPrimitiveTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  return factory.createBinaryExpression(
    factory.createTypeOfExpression(variable),
    SyntaxKind.EqualsEqualsEqualsToken,
    factory.createStringLiteral(getPrimitiveType(data)),
  )
}
