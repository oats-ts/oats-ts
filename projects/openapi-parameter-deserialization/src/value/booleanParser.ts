import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type BooleanParserFn = {
  <T extends Primitive>(parser: ValueParser<boolean, T>): ValueParser<string, T>
  (): ValueParser<string, boolean>
}

export const booleanParser: BooleanParserFn =
  <T extends Primitive>(parser: ValueParser<boolean, any> = identityParser): ValueParser<string, T> =>
  (name: string, value: string): T => {
    if (value !== 'true' && value !== 'false') {
      throw new TypeError(`Parameter "${name}" should be a boolean ("true" or "false")`)
    }
    const boolValue = value === 'true'
    return parser(name, boolValue)
  }
