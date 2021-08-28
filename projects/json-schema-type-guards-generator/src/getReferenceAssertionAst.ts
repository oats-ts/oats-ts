import { ReferenceObject } from '@oats-ts/json-schema-model'
import { Expression, factory } from 'typescript'
import { FullTypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { isNil } from 'lodash'
import { getTypeAssertionAst } from './getTypeAssertionAst'

export function getReferenceAssertionAst(
  data: ReferenceObject,
  context: TypeGuardGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { nameOf, dereference } = context
  if (!config.references && level > 0) {
    return factory.createTrue()
  }
  const refTarget = dereference(data)
  const name = nameOf(refTarget, context.produces)
  if (isNil(name)) {
    // Not increasing level here so named refs can be validated.
    return getTypeAssertionAst(refTarget, context, variable, config, level)
  }
  return factory.createCallExpression(factory.createIdentifier(name), [], [variable])
}
