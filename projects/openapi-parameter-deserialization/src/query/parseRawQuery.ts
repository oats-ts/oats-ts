import { RawQueryParams } from '../types'
import { has } from '../utils'

export function parseRawQuery(query: string): RawQueryParams {
  if (query.length === 0) {
    return {}
  }

  const sliced = query
    .slice(1) // Remove initial "?"
    .split('&') // Split key=value&key2=value2 string on "&"
    .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

  return sliced.reduce((record: RawQueryParams, [rawKey, rawValue]) => {
    const key = decodeURIComponent(rawKey)
    if (has(record, key)) {
      record[key].push(rawValue)
    } else {
      record[key] = [rawValue]
    }
    return record
  }, {})
}
