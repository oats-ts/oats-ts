import { Try, failure } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueParser } from '../types'
import { identityParser } from './identityParser'

type NumberParserFn = {
  <T extends Primitive>(parser: ValueParser<number, T>): ValueParser<string, T>
  (): ValueParser<string, number>
}

export const numberParser: NumberParserFn =
  <T extends Primitive>(parser: ValueParser<number, any> = identityParser): ValueParser<string, T> =>
  (value: string, name: string, path: string, config: ValidatorConfig): Try<T> => {
    if (typeof value !== 'string') {
      return failure([
        {
          message: `should not be ${value}`,
          path,
          severity: 'error',
          type: IssueTypes.type,
        },
      ])
    }
    const numValue = Number(value)
    if (value.length === 0 || isNaN(numValue)) {
      return failure([
        {
          message: `should be a number, but was ${value}`,
          path,
          severity: 'error',
          type: IssueTypes.value,
        },
      ])
    }
    return parser(numValue, name, path, config)
  }
