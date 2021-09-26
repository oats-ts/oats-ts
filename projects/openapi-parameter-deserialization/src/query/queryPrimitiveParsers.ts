import { Primitive, PrimitiveParser } from '../types'
import { isNil } from '../utils'

export const queryIdentityParser = <T>(name: string, value: T) => value

export const queryOptionalParser =
  <I extends Primitive, O extends Primitive>(parser: PrimitiveParser<I, O>): PrimitiveParser<I, O | undefined> =>
  (name: string, value: I): O | undefined => {
    return isNil(value) ? undefined : parser(name, value)
  }

export const queryStringParser =
  <T extends Primitive>(parser: PrimitiveParser<string, T>): PrimitiveParser<string, T> =>
  (name: string, value: string): T => {
    if (typeof value !== 'string') {
      throw new TypeError(`Parameter "${name}" should be a string.`)
    }
    return parser(name, value)
  }

export const queryNumberParser =
  <T extends Primitive>(parser: PrimitiveParser<number, T>): PrimitiveParser<string, T> =>
  (name: string, value: string): T => {
    const numValue = Number(value)
    if (value.length === 0 || isNaN(numValue)) {
      throw new TypeError(`Parameter "${name}" should be a number.`)
    }
    return parser(name, numValue)
  }

export const queryBooleanParser =
  <T extends Primitive>(parser: PrimitiveParser<boolean, T>): PrimitiveParser<string, T> =>
  (name: string, value: string): T => {
    if (value !== 'true' && value !== 'false') {
      throw new TypeError(`Parameter "${name}" should be a boolean ("true" or "false")`)
    }
    const boolValue = value === 'true'
    return parser(name, boolValue)
  }

export const queryLiteralParser =
  <T extends Primitive, L extends T>(literal: L): PrimitiveParser<T, L> =>
  (name: string, value: T): L => {
    if (value !== literal) {
      const strLiteral = typeof literal === 'string' ? `"${literal}"` : literal
      throw new TypeError(`Parameter "${name}" should be ${strLiteral}.`)
    }
    return value as L
  }

export const queryEnumerationParser =
  <T extends Primitive, E extends T>(values: E[]): PrimitiveParser<T, E> =>
  (name: string, value: T): E => {
    if (values.indexOf(value as E) < 0) {
      const valuesLiteral = values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      throw new TypeError(`Parameter "${name}" should be one of ${valuesLiteral}.`)
    }
    return value as E
  }
