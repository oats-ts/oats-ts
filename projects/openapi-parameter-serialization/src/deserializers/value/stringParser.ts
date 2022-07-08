import { Try, failure } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../../types'
import { identityParser } from './identityParser'

type StringParserFn = {
  <T extends Primitive>(parser: ValueDeserializer<string, T>): ValueDeserializer<string, T>
  (): ValueDeserializer<string, string>
}

export const stringParser: StringParserFn =
  <T extends Primitive>(parser: ValueDeserializer<string, any> = identityParser): ValueDeserializer<string, T> =>
  (value: string | undefined, name: string, path: string, config: ValidatorConfig): Try<T> => {
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
