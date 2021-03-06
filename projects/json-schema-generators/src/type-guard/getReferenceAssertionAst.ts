import { ReferenceObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { TypeGuardGeneratorConfig } from './typings'
import { isNil } from 'lodash'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { JsonSchemaGeneratorContext } from '../types'

export function getReferenceAssertionAst(
  data: ReferenceObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { nameOf, dereference } = context
  const refTarget = dereference(data)
  const name = nameOf(refTarget, 'json-schema/type-guard')
  if (isNil(name)) {
    // Not increasing level here so named refs can be validated.
    return getTypeAssertionAst(refTarget, context, variable, config, level)
  }
  return factory.createAsExpression(
    factory.createCallExpression(factory.createIdentifier(name), [], [variable]),
    factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
  )
}
