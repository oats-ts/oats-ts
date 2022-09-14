import { CookieValue } from '@oats-ts/openapi-http'
import { failure, success, Try } from '@oats-ts/try'
import { RawSetCookieParams } from '../../types'
import { decode, has, isNil } from '../../utils'

function parseRawCookieValue(cookieValue: string): [string, CookieValue<string>] {
  const [firstPart, ...parts] = cookieValue.split('; ')
  const [rawName, rawValue] = firstPart.split('=')
  const name = decode(rawName)
  const data: CookieValue<string> = { value: rawValue }
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i]
    if (part === 'HttpOnly') {
      data.httpOnly = true
      continue
    }
    if (part === 'Secure') {
      data.secure = true
      continue
    }
    const [name, value] = part.split('=')
    switch (name.trim()) {
      case 'Expires': {
        data.expires = value
        break
      }
      case 'Max-Age': {
        data.maxAge = Number(value)
        break
      }
      case 'Domain': {
        data.domain = value
        break
      }
      case 'Path': {
        data.path = value
        break
      }
      case 'SameSite': {
        data.sameSite = value as CookieValue<unknown>['sameSite']
        break
      }
      default:
        throw new Error(`unknown cookie configuration: "${name}"`)
    }
  }
  return [name, data]
}

export function parseRawSetCookie(cookie: string, path: string): Try<RawSetCookieParams> {
  if (isNil(cookie) || cookie.length === 0) {
    return success({})
  }
  try {
    const cookieValues = cookie
      .trim() // Remove any possible excess whitespace from beginning and end
      .split(', ') // Split on comma, this gives us the possibly merged header values

    const data = cookieValues.reduce((record: RawSetCookieParams, cookieValue) => {
      const [name, data] = parseRawCookieValue(cookieValue)
      if (!has(record, name)) {
        record[name] = []
      }
      record[name].push(data)
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
