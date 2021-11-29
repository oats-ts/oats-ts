import { Primitive, ValueParser } from '../types'
import { isNil } from '../utils'

export const optionalParser =
  <I extends Primitive, O extends Primitive>(parser: ValueParser<I, O>): ValueParser<I, O | undefined> =>
  (name: string, value: I): O | undefined => {
    return isNil(value) ? undefined : parser(name, value)
  }
