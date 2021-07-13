import { ReferenceObject, SchemaObject } from 'openapi3-ts'
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
): Expression {
  const { nameOf, dereference } = context
  if (config.references) {
    const refTarget = dereference(data)
    const name = nameOf(refTarget, 'openapi/type-guard')
    if (isNil(name)) {
      return getTypeAssertionAst(refTarget, context, variable, config)
    }
    return factory.createCallExpression(factory.createIdentifier(name), [], [variable])
  }
  return factory.createTrue()
}
