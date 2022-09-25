import { failure, success, Try } from '@oats-ts/try'
import { RawCookieParams } from '../../types'
import { decode, has, isNil } from '../../utils'

export function parseRawCookie(cookie: string | undefined, path: string): Try<RawCookieParams> {
  if (isNil(cookie) || cookie.length === 0) {
    return success({})
  }

  try {
    const sliced = cookie
      .trim() // Remove any possible excess whitespace from beginning and end
      .split('; ') // Split on semicolon
      .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

    const data = sliced.reduce((record: RawCookieParams, [rawKey, rawValue]) => {
      const key = decode(rawKey)
      if (!has(record, key)) {
        record[key] = []
      }
      record[key].push(rawValue)
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
