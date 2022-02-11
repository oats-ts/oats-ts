import { PrimitiveArray } from '../types'
import { encode } from '../utils'

export function joinArrayItems(prefix: string, separator: string, items: PrimitiveArray): string {
  const itemsStr = items.map((item) => encode(item)).join(separator)
  return `${prefix}${itemsStr}`
}
