import { RawSetCookieValues, SetCookieValue } from '@oats-ts/openapi-http'
import { failure, success, Try } from '@oats-ts/try'
import { decode, has, isNil } from '../../utils'

function deserializeSetCookieValue(cookieValue: string): [string, SetCookieValue<string>] {
  const [firstPart, ...parts] = cookieValue.split('; ')
  const [rawName, rawValue] = firstPart.split('=')
  const name = decode(rawName)
  const data: SetCookieValue<string> = { value: rawValue }
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
    const [propName, propValue] = part.split('=')
    switch (propName.trim()) {
      case 'Expires': {
        data.expires = propValue
        break
      }
      case 'Max-Age': {
        data.maxAge = Number(propValue)
        break
      }
      case 'Domain': {
        data.domain = propValue
        break
      }
      case 'Path': {
        data.path = propValue
        break
      }
      case 'SameSite': {
        data.sameSite = propValue as SetCookieValue<unknown>['sameSite']
        break
      }
      default:
        throw new Error(`unknown cookie configuration: "${propName}"`)
    }
  }
  return [name, data]
}

export function deserializeSetCookie(cookie: string | undefined, path: string): Try<RawSetCookieValues> {
  if (isNil(cookie) || cookie.length === 0) {
    return success({})
  }
  try {
    const cookieValues = cookie
      .trim() // Remove any possible excess whitespace from beginning and end
      .split(', ') // Split on comma, this gives us the possibly merged header values

    const data = cookieValues.reduce((record: RawSetCookieValues, cookieValue) => {
      const [name, data] = deserializeSetCookieValue(cookieValue)
      if (!has(record, name)) {
        record[name] = [data]
      } else {
        record[name].push(data)
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
