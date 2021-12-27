import { Try, failure } from '@oats-ts/try'
import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type StringParserFn = {
  <T extends Primitive>(parser: ValueParser<string, T>): ValueParser<string, T>
  (): ValueParser<string, string>
}

export const stringParser: StringParserFn =
  <T extends Primitive>(parser: ValueParser<string, any> = identityParser): ValueParser<string, T> =>
  (name: string, value: string): Try<T> => {
    if (typeof value !== 'string') {
      return failure([{ message: `Parameter "${name}" should be a string.`, path: name, severity: 'error', type: '' }])
    }
    return parser(name, value)
  }
