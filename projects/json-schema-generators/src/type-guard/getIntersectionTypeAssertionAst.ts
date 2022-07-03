import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, SyntaxKind } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getIntersectionTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { allOf = [] } = data
  const expressions = allOf.map((item) => getTypeAssertionAst(item, context, variable, config, level + 1))
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
