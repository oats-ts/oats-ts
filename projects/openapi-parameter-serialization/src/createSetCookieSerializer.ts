import { CookieDslRoot, ParameterValue, SetCookieSerializer, CookieParameterType } from './types'

import { createCookieSerializers } from './createCookieSerializers'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromRecord, isFailure, isSuccess, Try } from '@oats-ts/try'
import { Cookies, CookieValue } from '@oats-ts/openapi-http'
import { encode, isNil } from './utils'

export function createSetCookieSerializer<T extends CookieParameterType>(
  dsl: CookieDslRoot<T>,
): SetCookieSerializer<T> {
  const serializers = createCookieSerializers(dsl)
  return function setCookieSerializer(
    input: Cookies<T>,
    path: string = 'cookies',
    config: ValidatorConfig = DefaultConfig,
  ): Try<Cookies<Record<string, string>>> {
    const serializedParts = Object.keys(serializers).reduce(
      (cookies: Record<string, Try<CookieValue<string>>>, key: string): Record<string, Try<CookieValue<string>>> => {
        const serializer = serializers[key]
        const cookie = input?.[key as keyof T] as CookieValue<ParameterValue>
        const serialized = serializer(cookie?.value, key, config.append(path, key as string | number), config)
        if ((isSuccess(serialized) && !isNil(serialized.data)) || isFailure(serialized)) {
          cookies[encode(key)] = fluent(serialized).map((value): CookieValue<string> => ({ ...cookie, value: value! }))
        }
        return cookies
      },
      {},
    )
    return fromRecord(serializedParts)
  }
}
