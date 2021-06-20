import { isNil } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { Expression, factory, SyntaxKind } from 'typescript'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { reduceExpressions } from './reduceExpressions'
import { FullTypeGuardGeneratorConfig } from './typings'

export function getUnionTypeAssertionAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  const { accessor } = context
  if (isNil(data.discriminator) || !config.unionReferences) {
    return reduceExpressions(
      SyntaxKind.BarBarToken,
      data.oneOf.map((refOrSchema) => getTypeAssertionAst(refOrSchema, context, variable, config)),
    )
  }
  return reduceExpressions(
    SyntaxKind.BarBarToken,
    data.oneOf.map((refOrSchema) => {
      const schema = accessor.dereference<SchemaObject>(refOrSchema)
      return factory.createCallExpression(factory.createIdentifier(accessor.name(schema, 'type-guard')), [], [variable])
    }),
  )
}
