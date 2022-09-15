import { Try, success } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { CookieParameterDeserializer, DslConfig, Primitive, ValueDeserializer } from '../../types'
import { decode, isNil } from '../../utils'

export const cookieFormPrimitive =
  <T extends Primitive>(
    parse: ValueDeserializer<string, T>,
    options: Partial<DslConfig> = {},
  ): CookieParameterDeserializer<T> =>
  (data: string, name: string, path: string, config: ValidatorConfig): Try<T> => {
    if (isNil(data)) {
      return success(undefined!)
    }
    return parse(decode(data), name, path, config)
  }
