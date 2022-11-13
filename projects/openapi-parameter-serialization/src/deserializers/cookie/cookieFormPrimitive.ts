import { CookieValue } from '@oats-ts/openapi-http'
import { Try, failure } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { CookieParameterDeserializer, DslConfig, Primitive, ValueDeserializer } from '../../types'
import { decode } from '../../utils'

export const cookieFormPrimitive =
  <T extends Primitive>(
    parse: ValueDeserializer<string, T>,
    options: Partial<DslConfig> = {},
  ): CookieParameterDeserializer<T> =>
  (data: CookieValue[], name: string, path: string, config: ValidatorConfig): Try<T> => {
    switch (data.length) {
      case 0: {
        return parse(undefined, name, path, config)
      }
      case 1: {
        return parse(decode(data[0].value), name, path, config)
      }
      default: {
        return failure({
          message: `duplicate cookie, should occur maximum once (found ${data.length} times)`,
          path,
          severity: 'error',
        })
      }
    }
  }
