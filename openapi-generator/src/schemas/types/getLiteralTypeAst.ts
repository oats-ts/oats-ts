import {
  BooleanLiteral,
  booleanLiteral,
  NumericLiteral,
  numericLiteral,
  StringLiteral,
  stringLiteral,
} from '@babel/types'

export function getLiteralTypeAst(value: string | number | boolean): StringLiteral | NumericLiteral | BooleanLiteral {
  if (typeof value === 'string') {
    return stringLiteral(value)
  } else if (typeof value === 'number') {
    return numericLiteral(value)
  } else if (typeof value === 'boolean') {
    return booleanLiteral(value)
  }
}
