import { ReferenceObject } from '@oats-ts/json-schema-model'
import { Expression, factory } from 'typescript'
import { FullTypeGuardGeneratorConfig } from './typings'
import { isNil } from 'lodash'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getReferenceAssertionAst(
  data: ReferenceObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { nameOf, dereference } = context
  if (!config.references && level > 0) {
    return factory.createTrue()
  }
  const refTarget = dereference(data)
  const name = nameOf(refTarget, 'json-schema/type-guard')
  if (isNil(name)) {
    // Not increasing level here so named refs can be validated.
    return getTypeAssertionAst(refTarget, context, variable, config, level)
  }
  return factory.createCallExpression(factory.createIdentifier(name), [], [variable])
}
