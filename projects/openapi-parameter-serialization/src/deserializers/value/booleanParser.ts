import { Try, failure } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive } from '../..//types'
import { ValueParser } from '../types'
import { identityParser } from './identityParser'

type BooleanParserFn = {
  <T extends Primitive>(parser: ValueParser<boolean, T>): ValueParser<string, T>
  (): ValueParser<string, boolean>
}

export const booleanParser: BooleanParserFn =
  <T extends Primitive>(parser: ValueParser<boolean, any> = identityParser): ValueParser<string, T> =>
  (value: string, name: string, path: string, config: ValidatorConfig): Try<T> => {
    if (value !== 'true' && value !== 'false') {
      return failure([
        {
          message: `should be a boolean ("true" or "false")`,
          path,
          severity: 'error',
          type: IssueTypes.value,
        },
      ])
    }
    const boolValue = value === 'true'
    return parser(boolValue, name, path, config)
  }
