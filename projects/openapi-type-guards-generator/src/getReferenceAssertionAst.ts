import { ReferenceObject } from 'openapi3-ts'
import { Expression, factory } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { FullTypeGuardGeneratorConfig } from './typings'
import { isNil } from 'lodash'
import { getTypeAssertionAst } from './getTypeAssertionAst'

export function getReferenceAssertionAst(
  data: ReferenceObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { nameOf, dereference } = context
  if (!config.references && level > 0) {
    return factory.createTrue()
  }
  const refTarget = dereference(data)
  const name = nameOf(refTarget, 'openapi/type-guard')
  if (isNil(name)) {
    // Not increasing level here so named refs can be validated.
    return getTypeAssertionAst(refTarget, context, variable, config, level)
  }
  return factory.createCallExpression(factory.createIdentifier(name), [], [variable])
}
