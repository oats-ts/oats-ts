import { Primitive, PrimitiveArray } from '../types'
import { encode } from '../utils'

export function joinKeyValuePairs(
  prefix: string,
  kvSeparator: string,
  separator: string,
  items: [string, Primitive][],
  allowReserved: boolean,
): string {
  const itemsStr = items
    .map(([key, value]) => {
      const keyStr = encode(key, allowReserved)
      const valStr = encode(value, allowReserved)
      return `${keyStr}${kvSeparator}${valStr}`
    })
    .join(separator)
  return `${prefix}${itemsStr}`
}
