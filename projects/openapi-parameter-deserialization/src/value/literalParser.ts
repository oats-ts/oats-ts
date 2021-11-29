import { Primitive, ValueParser } from '../types'

export const literalParser =
  <T extends Primitive, L extends T>(literal: L): ValueParser<T, L> =>
  (name: string, value: T): L => {
    if (value !== literal) {
      const strLiteral = typeof literal === 'string' ? `"${literal}"` : literal
      throw new TypeError(`Parameter "${name}" should be ${strLiteral}.`)
    }
    return value as L
  }
