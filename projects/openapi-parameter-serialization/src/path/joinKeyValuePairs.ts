import { Primitive } from '../types'
import { encode, isNil } from '../utils'

export function joinKeyValuePairs(
  prefix: string,
  kvSeparator: string,
  separator: string,
  items: [string, Primitive][],
  replaceDot: boolean = false,
): string {
  const itemsStr = items
    .filter(([, value]) => !isNil(value))
    .map(([key, value]) => {
      const keyStr = encode(key, replaceDot)
      const valStr = encode(value, replaceDot)
      return `${keyStr}${kvSeparator}${valStr}`
    })
    .join(separator)
  return `${prefix}${itemsStr}`
}
