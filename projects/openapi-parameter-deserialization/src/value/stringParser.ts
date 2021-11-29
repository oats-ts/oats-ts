import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type StringParserFn = {
  <T extends Primitive>(parser: ValueParser<string, T>): ValueParser<string, T>
  (): ValueParser<string, string>
}

export const stringParser: StringParserFn =
  <T extends Primitive>(parser: ValueParser<string, any> = identityParser): ValueParser<string, T> =>
  (name: string, value: string): T => {
    if (typeof value !== 'string') {
      throw new TypeError(`Parameter "${name}" should be a string.`)
    }
    return parser(name, value)
  }
