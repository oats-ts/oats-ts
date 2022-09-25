import { Try, success, failure } from '@oats-ts/try'
import { RawQueryParams } from '../../types'
import { decode, has, isNil } from '../../utils'

export function parseRawQuery(query: string, path: string): Try<RawQueryParams> {
  if (isNil(query) || query.length === 0) {
    return success({})
  }
  try {
    const sliced = query
      .slice(1) // Remove initial "?"
      .split('&') // Split key=value&key2=value2 string on "&"
      .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

    const data = sliced.reduce((record: RawQueryParams, [rawKey, rawValue]) => {
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
