import { Try, failure, success } from '@oats-ts/try'
import { Primitive, ValueParser } from '../types'

export const enumerationParser =
  <T extends Primitive, E extends T>(values: E[]): ValueParser<T, E> =>
  (name: string, value: T): Try<E> => {
    if (values.indexOf(value as E) < 0) {
      const valuesLiteral = values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      return failure([
        {
          message: `Parameter "${name}" should be one of ${valuesLiteral}.`,
          path: name,
          severity: 'error',
          type: '',
        },
      ])
    }
    return success(value as E)
  }
