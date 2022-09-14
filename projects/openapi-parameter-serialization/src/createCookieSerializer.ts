import { CookieDslRoot, CookieSerializer, ParameterType } from './types'

import { createCookieSerializers } from './createCookieSerializers'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromArray, Try } from '@oats-ts/try'
import { encode } from './utils'

export function createCookieSerializer<T extends ParameterType>(dsl: CookieDslRoot<T>): CookieSerializer<T> {
  const serializers = createCookieSerializers(dsl)
  return function cookieSerializer(
    input: T,
    path: string = 'cookie',
    config: ValidatorConfig = DefaultConfig,
  ): Try<string> {
    const serializedParts = Object.keys(serializers).map((key: string): Try<[string, string | undefined]> => {
      const serializer = serializers[key]
      const cookieValue = input?.[key as keyof T]
      const serialized = serializer(cookieValue, key, config.append(path, key as string | number), config)
      return fluent(serialized).map((value) => [key, value])
    })
    return fluent(fromArray(serializedParts))
      .map((cookies) =>
        cookies.filter(([, value]) => value !== undefined).map(([name, value]) => `${encode(name)}=${encode(value)}`),
      )
      .map((values) => values.join('; '))
  }
}
