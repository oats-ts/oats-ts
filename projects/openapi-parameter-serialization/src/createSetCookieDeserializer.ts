import { CookieDslRoot, ParameterValue, SetCookieDeserializer, CookieParameterType } from './types'

import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { createCookieDeserializers } from './createCookieDeserializers'
import { parseRawSetCookie } from './deserializers/cookie/parseRawSetCookie'
import { Cookies, CookieValue } from '@oats-ts/openapi-http'

export function createSetCookieDeserializer<T extends CookieParameterType>(
  root: CookieDslRoot<T>,
): SetCookieDeserializer<T> {
  const deserializers = createCookieDeserializers(root)
  return function headerDeserializer(
    input: string | undefined,
    path: string = 'cookies',
    config: ValidatorConfig = DefaultConfig,
  ): Try<Cookies<T>> {
    return fluent(parseRawSetCookie(input, path)).flatMap((rawData) => {
      const parsedData = Object.keys(deserializers).reduce(
        (acc: Record<string, Try<CookieValue<ParameterValue>>>, key: string) => {
          const values = rawData[key] ?? []
          switch (values.length) {
            case 0: {
              acc[key] = success({ value: undefined })
              break
            }
            case 1: {
              const deserializer = deserializers?.[key]
              const cookie = values[0]
              const stringValue = cookie.value
              acc[key] = fluent(deserializer(stringValue, key, config.append(path, key), config)).map(
                (value): CookieValue<ParameterValue> => ({
                  ...cookie,
                  value,
                }),
              )
              break
            }
            default: {
              acc[key] = failure({
                message: `should occur once or 0 times (found ${values.length} times)`,
                path,
                severity: 'error',
              })
              break
            }
          }
          return acc
        },
        {},
      )
      return fromRecord(parsedData) as Try<Cookies<T>>
    })
  }
}
