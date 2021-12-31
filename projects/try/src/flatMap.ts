import { isFailure } from './isFailure'
import { Try } from './types'

export function flatMap<I, O>(input: Try<I>, transform: (input: I) => Try<O>): Try<O> {
  return isFailure(input) ? input : transform(input.data)
}
