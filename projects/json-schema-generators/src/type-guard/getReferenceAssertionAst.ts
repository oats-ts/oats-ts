import { ReferenceObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { TypeGuardGeneratorConfig } from './typings'
import { isNil } from 'lodash'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getReferenceAssertionAst(
  data: ReferenceObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  helper: TraversalHelper,
  level: number,
): Expression {
  const refTarget = context.dereference(data)
  const name = context.nameOf(refTarget, 'oats/type-guard')
  if (isNil(name)) {
    // Not increasing level here so named refs can be validated.
    return getTypeAssertionAst(refTarget, context, variable, config, helper, level)
  }
  return factory.createAsExpression(
    factory.createCallExpression(factory.createIdentifier(name), [], [variable]),
    factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword),
  )
}
