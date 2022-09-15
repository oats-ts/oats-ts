import { CookieDslRoot, ParameterValue, SetCookieSerializer, CookieParameterType } from './types'

import { createCookieSerializers } from './createCookieSerializers'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromArray, Try } from '@oats-ts/try'
import { Cookies, CookieValue } from '@oats-ts/openapi-http'
import { serializeCookieValue } from './serializers/cookie/serializeCookieValue'

export function createSetCookieSerializer<T extends CookieParameterType>(
  dsl: CookieDslRoot<T>,
): SetCookieSerializer<T> {
  const serializers = createCookieSerializers(dsl)
  return function headerSerializer(
    input: Cookies<T>,
    path: string = 'cookies',
    config: ValidatorConfig = DefaultConfig,
  ): Try<string[]> {
    const serializedParts = Object.keys(serializers).map(
      (key: string): Try<[CookieValue<any>, string, string | undefined]> => {
        const serializer = serializers[key]
        const cookie = input?.[key as keyof T] as CookieValue<ParameterValue>
        const serialized = serializer(cookie?.value, key, config.append(path, key as string | number), config)
        return fluent(serialized).map((value) => [cookie, key, value])
      },
    )
    return fluent(fromArray(serializedParts)).map((cookies) =>
      cookies
        .filter(([, , value]) => value !== undefined)
        .map(([cookie, name, value]) => serializeCookieValue(cookie, name, value!)),
    )
  }
}
