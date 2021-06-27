import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { FullTypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'

export function getUnionTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  const { accessor } = context
  if (isNil(data.discriminator) || !config.unionReferences) {
    return reduceLogicalExpressions(
      SyntaxKind.BarBarToken,
      data.oneOf.map((refOrSchema) => getTypeAssertionAst(refOrSchema, context, variable, config)),
    )
  }
  return reduceLogicalExpressions(
    SyntaxKind.BarBarToken,
    data.oneOf.map((refOrSchema) => {
      const schema = accessor.dereference<SchemaObject>(refOrSchema)
      return factory.createCallExpression(factory.createIdentifier(accessor.name(schema, 'type-guard')), [], [variable])
    }),
  )
}
