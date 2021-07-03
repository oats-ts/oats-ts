import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { Expression, factory } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { FullTypeGuardGeneratorConfig } from './typings'

export function getReferenceAssertionAst(
  data: ReferenceObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  const { accessor } = context
  if (config.references) {
    const schema = accessor.dereference<SchemaObject>(data)
    return factory.createCallExpression(factory.createIdentifier(accessor.name(schema, 'openapi/type-guard')), [], [variable])
  }
  return factory.createTrue()
}
