import { CookieDslRoot, ParameterValue, SetCookieSerializer, ParameterType } from './types'

import { createCookieSerializers } from './createCookieSerializers'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { fluent, fromArray, Try } from '@oats-ts/try'
import { Cookies, CookieValue } from '@oats-ts/openapi-http'
import { encode, isNil } from './utils'

function cookieToString(cookie: CookieValue<any>, name: string, value: string): string {
  const parts: string[] = [`${encode(name)}=${encode(value)}`]
  if (!isNil(cookie.expires)) {
    parts.push(`Expires=${cookie.expires}`)
  }
  if (!isNil(cookie.maxAge)) {
    parts.push(`Max-Age=${cookie.maxAge}`)
  }
  if (!isNil(cookie.domain)) {
    parts.push(`Domain=${cookie.domain}`)
  }
  if (!isNil(cookie.path)) {
    parts.push(`Path=${cookie.path}`)
  }
  if (!isNil(cookie.secure)) {
    parts.push(`Secure`)
  }
  if (!isNil(cookie.httpOnly)) {
    parts.push(`HttpOnly`)
  }
  if (!isNil(cookie.sameSite)) {
    parts.push(`SameSite=${cookie.sameSite}`)
  }
  return parts.join('; ')
}

export function createSetCookieSerializer<T extends ParameterType>(dsl: CookieDslRoot<T>): SetCookieSerializer<T> {
  const serializers = createCookieSerializers(dsl)
  return function headerSerializer(
    input: Cookies<T>,
    path: string = 'cookie',
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
        .map(([cookie, name, value]) => cookieToString(cookie, name, value!)),
    )
  }
}
