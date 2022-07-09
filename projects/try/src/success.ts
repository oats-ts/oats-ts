import { SUCCESS_SYMBOL } from './symbols'
import { Success } from './types'

export function success<T>(data: T): Success<T> {
  return { data, [SUCCESS_SYMBOL]: true }
}
