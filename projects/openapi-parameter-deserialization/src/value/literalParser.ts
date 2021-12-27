import { Try, failure, success } from '@oats-ts/try'
import { Primitive, ValueParser } from '../types'

export const literalParser =
  <T extends Primitive, L extends T>(literal: L): ValueParser<T, L> =>
  (name: string, value: T): Try<L> => {
    if (value !== literal) {
      const strLiteral = typeof literal === 'string' ? `"${literal}"` : literal
      return failure([
        { message: `Parameter "${name}" should be ${strLiteral}.`, path: name, severity: 'error', type: '' },
      ])
    }
    return success(value as L)
  }
