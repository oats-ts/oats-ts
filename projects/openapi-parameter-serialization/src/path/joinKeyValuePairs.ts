import { Primitive, PrimitiveArray } from '../types'
import { encode } from '../utils'

export function joinKeyValuePairs(
  prefix: string,
  kvSeparator: string,
  separator: string,
  items: [string, Primitive][],
): string {
  const itemsStr = items
    .map(([key, value]) => {
      const keyStr = encode(key)
      const valStr = encode(value)
      return `${keyStr}${kvSeparator}${valStr}`
    })
    .join(separator)
  return `${prefix}${itemsStr}`
}
