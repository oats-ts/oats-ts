import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getPrimitiveType } from '@oats-ts/model-common'
import { FullTypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import {} from '@oats-ts/typescript-common'

export function getPrimitiveTypeAssertionAst(
  data: SchemaObject,
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  return factory.createBinaryExpression(
    factory.createTypeOfExpression(variable),
    SyntaxKind.EqualsEqualsEqualsToken,
    factory.createStringLiteral(getPrimitiveType(data)),
  )
}
