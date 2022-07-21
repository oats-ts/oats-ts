import { Try, failure } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../../types'
import { identityParser } from './identityParser'

type BooleanParserFn = {
  <T extends Primitive>(parser: ValueDeserializer<boolean, T>): ValueDeserializer<string, T>
  (): ValueDeserializer<string, boolean>
}

export const booleanParser: BooleanParserFn =
  <T extends Primitive>(parser: ValueDeserializer<boolean, any> = identityParser): ValueDeserializer<string, T> =>
  (value: string | undefined, name: string, path: string, config: ValidatorConfig): Try<T> => {
    if (value !== 'true' && value !== 'false') {
      return failure([
        {
          message: `should be a boolean ("true" or "false")`,
          path,
          severity: 'error',
        },
      ])
    }
    const boolValue = value === 'true'
    return parser(boolValue, name, path, config)
  }
