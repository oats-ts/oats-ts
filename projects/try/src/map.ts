import { isFailure } from './isFailure'
import { success } from './success'
import { Try } from './types'

export function map<I, O>(input: Try<I>, transform: (input: I) => O): Try<O> {
  return isFailure(input) ? input : success(transform(input.data))
}
