import { PrimitiveArray } from '../types'
import { encode } from '../utils'

export function joinArrayItems(
  prefix: string,
  separator: string,
  items: PrimitiveArray,
  allowReserved: boolean,
): string {
  const itemsStr = items.map((item) => encode(item, allowReserved)).join(separator)
  return `${prefix}${itemsStr}`
}
