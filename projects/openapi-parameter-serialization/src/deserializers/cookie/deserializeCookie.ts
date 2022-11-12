import { RawCookieValues } from '@oats-ts/openapi-http'
import { failure, success, Try } from '@oats-ts/try'
import { decode, has, isNil } from '../../utils'

export function deserializeCookie(cookie: string | undefined, path: string): Try<RawCookieValues> {
  if (isNil(cookie) || cookie.length === 0) {
    return success({})
  }

  try {
    const sliced = cookie
      .trim() // Remove any possible excess whitespace from beginning and end
      .split('; ') // Split on semicolon
      .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

    const data = sliced.reduce((record: RawCookieValues, [rawKey, rawValue]) => {
      const key = decode(rawKey)
      if (!has(record, key)) {
        record[key] = [rawValue]
      } else {
        record[key].push(rawValue)
      }
      return record
    }, {})

    return success(data)
  } catch (e) {
    return failure({
      message: (e as Error)?.message,
      path,
      severity: 'error',
    })
  }
}
