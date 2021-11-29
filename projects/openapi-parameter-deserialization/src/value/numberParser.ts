import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type NumberParserFn = {
  <T extends Primitive>(parser: ValueParser<number, T>): ValueParser<string, T>
  (): ValueParser<string, number>
}

export const numberParser: NumberParserFn =
  <T extends Primitive>(parser: ValueParser<number, any> = identityParser): ValueParser<string, T> =>
  (name: string, value: string): T => {
    if (typeof value !== 'string') {
      throw new TypeError(`Unexpected value ${value} for parameter "${name}"`)
    }
    const numValue = Number(value)
    if (value.length === 0 || isNaN(numValue)) {
      throw new TypeError(`Parameter "${name}" should be a number, but was ${value}`)
    }
    return parser(name, numValue)
  }
