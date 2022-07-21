import { Try, failure } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../../types'
import { identityParser } from './identityParser'

type NumberParserFn = {
  <T extends Primitive>(parser: ValueDeserializer<number, T>): ValueDeserializer<string, T>
  (): ValueDeserializer<string, number>
}

export const numberParser: NumberParserFn =
  <T extends Primitive>(parser: ValueDeserializer<number, any> = identityParser): ValueDeserializer<string, T> =>
  (value: string | undefined, name: string, path: string, config: ValidatorConfig): Try<T> => {
    if (typeof value !== 'string') {
      return failure([
        {
          message: `should not be ${value}`,
          path,
          severity: 'error',
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
        },
      ])
    }
    return parser(numValue, name, path, config)
  }
