import { isNil } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, factory, SyntaxKind } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '../types'

export function getUnionTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { dereference, nameOf } = context
  if (isNil(data.discriminator)) {
    return reduceLogicalExpressions(
      SyntaxKind.BarBarToken,
      (data.oneOf ?? []).map((refOrSchema) => getTypeAssertionAst(refOrSchema, context, variable, config, level)),
    )
  }
  // Should be just schema objects at this point.
  return reduceLogicalExpressions(
    SyntaxKind.BarBarToken,
    (data.oneOf ?? []).map((refOrSchema) => {
      const schema = dereference<SchemaObject>(refOrSchema)
      return factory.createCallExpression(
        factory.createIdentifier(nameOf(schema, 'oats/type-guard')),
        [],
        [variable],
      )
    }),
  )
}
