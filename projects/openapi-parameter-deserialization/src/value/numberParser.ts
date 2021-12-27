import { Try, failure } from '@oats-ts/try'
import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type NumberParserFn = {
  <T extends Primitive>(parser: ValueParser<number, T>): ValueParser<string, T>
  (): ValueParser<string, number>
}

export const numberParser: NumberParserFn =
  <T extends Primitive>(parser: ValueParser<number, any> = identityParser): ValueParser<string, T> =>
  (name: string, value: string): Try<T> => {
    if (typeof value !== 'string') {
      return failure([
        { message: `Unexpected value ${value} for parameter "${name}"`, path: name, severity: 'error', type: '' },
      ])
    }
    const numValue = Number(value)
    if (value.length === 0 || isNaN(numValue)) {
      return failure([
        {
          message: `Parameter "${name}" should be a number, but was ${value}`,
          path: name,
          severity: 'error',
          type: '',
        },
      ])
    }
    return parser(name, numValue)
  }
