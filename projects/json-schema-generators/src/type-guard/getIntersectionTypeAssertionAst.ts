import { SchemaObject } from '@oats-ts/json-schema-model'
import { Expression, SyntaxKind } from 'typescript'
import { getTypeAssertionAst } from './getTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { reduceLogicalExpressions } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getIntersectionTypeAssertionAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  helper: TraversalHelper,
  level: number,
): Expression {
  const { allOf = [] } = data
  const expressions = allOf.map((item) => getTypeAssertionAst(item, context, variable, config, helper, level + 1))
  return reduceLogicalExpressions(SyntaxKind.AmpersandAmpersandToken, expressions)
}
