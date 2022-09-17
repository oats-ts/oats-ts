import { CookieDslRoot, ParameterValue, CookieDeserializer, CookieParameterType } from './types'

import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { createCookieDeserializers } from './createCookieDeserializers'
import { parseRawCookie } from './deserializers/cookie/parseRawCookie'

export function createCookieDeserializer<T extends CookieParameterType>(root: CookieDslRoot<T>): CookieDeserializer<T> {
  const deserializers = createCookieDeserializers(root)
  return function headerDeserializer(
    input: string | undefined,
    path: string = 'cookies',
    config: ValidatorConfig = DefaultConfig,
  ): Try<T> {
    return fluent(parseRawCookie(input, path)).flatMap((rawData) => {
      const parsedData = Object.keys(deserializers).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
        const values = rawData[key] ?? []
        switch (values.length) {
          case 0: {
            acc[key] = success(undefined)
            break
          }
          case 1: {
            const deserializer = deserializers?.[key]
            acc[key] = deserializer(values[0], key, config.append(path, key), config)
          }
          default: {
            acc[key] = failure({
              message: `should occur max once (found ${values.length} times)`,
              path: config.append(path, key),
              severity: 'error',
            })
          }
        }
        return acc
      }, {})
      return fromRecord(parsedData) as Try<T>
    })
  }
}