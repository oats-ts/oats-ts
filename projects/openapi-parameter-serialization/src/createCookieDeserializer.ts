import { CookieDslRoot, ParameterValue, CookieDeserializer, CookieParameterType } from './types'

import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromRecord, Try } from '@oats-ts/try'
import { createCookieDeserializers } from './createCookieDeserializers'
import { deserializeCookie } from './deserializers/cookie/deserializeCookie'

export function createCookieDeserializer<T extends CookieParameterType>(root: CookieDslRoot<T>): CookieDeserializer<T> {
  const deserializers = createCookieDeserializers(root)
  return function cookieDeserializer(
    input: string | undefined,
    path: string = 'cookies',
    config: ValidatorConfig = DefaultConfig,
  ): Try<T> {
    return fluent(deserializeCookie(input, path)).flatMap((rawData) => {
      const parsedData = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
        const values = rawData.filter(({ name }) => name === key)
        const deserializer = deserializers?.[key]
        acc[key] = deserializer(values, key, config.append(path, key), config)
        return acc
      }, {})
      return fromRecord(parsedData) as Try<T>
    })
  }
}
