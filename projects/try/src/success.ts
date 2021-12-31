import { Success } from './types'

export function success<T>(data: T): Success<T> {
  return { data }
}
