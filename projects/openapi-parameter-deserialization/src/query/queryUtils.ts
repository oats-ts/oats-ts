import { RawQueryParams } from '..'
import { QueryOptions } from '../types'

export function getQueryValue(name: string, params: RawQueryParams, options: QueryOptions): string {
  const values = params[name] || []
  switch (values.length) {
    case 0: {
      if (options.required) {
        throw new TypeError(`Query parameter "${name}" is required`)
      }
      return undefined
    }
    case 1: {
      return values[0]
    }
    default:
      throw new TypeError(`Query parameter "${name}" should occur once (found ${values.length} times in query string)`)
  }
}
