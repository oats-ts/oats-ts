import { Try, success } from '@oats-ts/try'
import { Primitive, ValueParser } from '../types'
import { isNil } from '../utils'

export const optionalParser =
  <I extends Primitive, O extends Primitive>(parser: ValueParser<I, O>): ValueParser<I, O | undefined> =>
  (name: string, value: I): Try<O | undefined> => {
    return isNil(value) ? success(undefined) : parser(name, value)
  }
