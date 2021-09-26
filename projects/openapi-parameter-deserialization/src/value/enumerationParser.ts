import { Primitive, ValueParser } from '../types'

export const enumerationParser =
  <T extends Primitive, E extends T>(values: E[]): ValueParser<T, E> =>
  (name: string, value: T): E => {
    if (values.indexOf(value as E) < 0) {
      const valuesLiteral = values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      throw new TypeError(`Parameter "${name}" should be one of ${valuesLiteral}.`)
    }
    return value as E
  }
