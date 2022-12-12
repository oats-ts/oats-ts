import { fromCaughtError } from './fromCaughtError'
import { success } from './success'
import { Try } from './types'

export function fromPromise<T>(input: Promise<T>): Promise<Try<T>> {
  return input.then((data) => success(data)).catch((error) => fromCaughtError(error))
}
