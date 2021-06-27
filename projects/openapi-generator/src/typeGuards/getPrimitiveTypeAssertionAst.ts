import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getPrimitiveType } from '../common/primitiveTypeUtils'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { FullTypeGuardGeneratorConfig } from './typings'

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
