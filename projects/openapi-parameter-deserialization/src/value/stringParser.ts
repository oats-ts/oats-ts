import { Try, failure } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type StringParserFn = {
  <T extends Primitive>(parser: ValueParser<string, T>): ValueParser<string, T>
  (): ValueParser<string, string>
}

export const stringParser: StringParserFn =
  <T extends Primitive>(parser: ValueParser<string, any> = identityParser): ValueParser<string, T> =>
  (value: string, name: string, path: string, config: ValidatorConfig): Try<T> => {
    if (typeof value !== 'string') {
      return failure([
        {
          message: `should be a string.`,
          path,
          severity: 'error',
          type: IssueTypes.type,
        },
      ])
    }
    return parser(value, name, path, config)
  }
