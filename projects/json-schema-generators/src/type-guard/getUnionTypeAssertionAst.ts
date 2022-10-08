import { isNil } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getUnionTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  helper: TraversalHelper,
  level: number,
): Expression {
  if (isNil(data.discriminator)) {
    return reduceLogicalExpressions(
      SyntaxKind.BarBarToken,
      (data.oneOf ?? []).map((refOrSchema) =>
        getTypeAssertionAst(refOrSchema, context, variable, config, helper, level),
      ),
    )
  }
  // Should be just schema objects at this point.
  return reduceLogicalExpressions(
    SyntaxKind.BarBarToken,
    (data.oneOf ?? []).map((refOrSchema) => {
      const schema = context.dereference<SchemaObject>(refOrSchema)
      return factory.createCallExpression(
        factory.createIdentifier(context.nameOf(schema, 'oats/type-guard')),
        [],
        [variable],
      )
    }),
  )
}
