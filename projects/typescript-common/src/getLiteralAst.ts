import { factory, StringLiteral, NumericLiteral, BooleanLiteral } from 'typescript'

export function getLiteralAst(value: string | number | boolean): StringLiteral | NumericLiteral | BooleanLiteral {
  if (typeof value === 'string') {
    return factory.createStringLiteral(value)
  } else if (typeof value === 'number') {
    return factory.createNumericLiteral(value)
  } else if (typeof value === 'boolean') {
    return value ? factory.createTrue() : factory.createFalse()
  }
  throw new TypeError(`Parameter must be a string, number or boolean literal`)
}
