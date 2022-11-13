import { CookieValue } from '@oats-ts/openapi-http'
import { failure, success, Try } from '@oats-ts/try'
import { decode, isNil } from '../../utils'

export function deserializeCookie(cookie: string | undefined, path: string): Try<CookieValue[]> {
  if (isNil(cookie) || cookie.length === 0) {
    return success([])
  }

  try {
    const sliced = cookie
      .trim() // Remove any possible excess whitespace from beginning and end
      .split('; ') // Split on semicolon
      .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

    return success(sliced.map(([rawKey, value]): CookieValue => ({ name: decode(rawKey), value })))
  } catch (e) {
    return failure({
      message: (e as Error)?.message,
      path,
      severity: 'error',
    })
  }
}
