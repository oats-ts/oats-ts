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
  level: number,
): Expression {
  const { dereference, nameOf } = context
  if (isNil(data.discriminator)) {
    return reduceLogicalExpressions(
      SyntaxKind.BarBarToken,
      data.oneOf.map((refOrSchema) => getTypeAssertionAst(refOrSchema, context, variable, config, level)),
    )
  }
  // Should be just schema objects at this point.
  return reduceLogicalExpressions(
    SyntaxKind.BarBarToken,
    data.oneOf.map((refOrSchema) => {
      const schema = dereference<SchemaObject>(refOrSchema)
      return factory.createCallExpression(
        factory.createIdentifier(nameOf(schema, 'openapi/type-guard')),
        [],
        [variable],
      )
    }),
  )
}
