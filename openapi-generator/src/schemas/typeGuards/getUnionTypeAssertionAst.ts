import {
  binaryExpression,
  Expression,
  identifier,
  memberExpression,
  stringLiteral,
  unaryExpression,
} from '@babel/types'
import { entries } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { logical } from '../../common/babelUtils'
import { isIdentifier } from '../../common/isIdentifier'
import { OpenAPIGeneratorContext } from '../../typings'

export function getUnionTypeAssertionAst(
  data: SchemaObject,
  discriminators: Record<string, string>,
  context: OpenAPIGeneratorContext,
): Expression {
  const objAssertions: Expression[] = [
    binaryExpression('!==', identifier('input'), identifier('null')),
    binaryExpression('===', unaryExpression('typeof', identifier('input')), stringLiteral('object')),
    ...entries(discriminators).map(([propName, value]) => {
      const member = isIdentifier(propName)
        ? memberExpression(identifier('input'), identifier(propName))
        : memberExpression(identifier('input'), stringLiteral(propName), true)
      return binaryExpression('===', member, stringLiteral(value))
    }),
  ]
  return logical('&&', objAssertions)
}
