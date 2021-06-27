import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { FullTypeGuardGeneratorConfig } from './typings'
import { getPrimitiveType } from '@oats-ts/typescript-common'

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
