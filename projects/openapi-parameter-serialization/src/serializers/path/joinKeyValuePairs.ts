import { Primitive } from '../../types'
import { encode, isNil } from '../../utils'

export function joinKeyValuePairs(
  prefix: string,
  kvSeparator: string,
  separator: string,
  items: [string, Primitive][],
): string {
  const itemsStr = items
    .filter(([, value]) => !isNil(value))
    .map(([key, value]) => {
      const keyStr = encode(key)
      const valStr = encode(value?.toString())
      return `${keyStr}${kvSeparator}${valStr}`
    })
    .join(separator)
  return `${prefix}${itemsStr}`
}
