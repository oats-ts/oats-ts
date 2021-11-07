import { PrimitiveArray } from '../types'
import { encode } from '../utils'

export function joinArrayItems(
  prefix: string,
  separator: string,
  items: PrimitiveArray,
  replaceDot: boolean = false,
): string {
  const itemsStr = items.map((item) => encode(item, replaceDot)).join(separator)
  return `${prefix}${itemsStr}`
}
