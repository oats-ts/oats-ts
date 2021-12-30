import { FluentTry, Try } from './types'
import { FluentFailure } from './FluentFailure'
import { FluentSuccess } from './FluentSuccess'
import { isSuccess } from './isSuccess'

export function fluent<T>(input: Try<T>): FluentTry<T> {
  if (input instanceof FluentFailure || input instanceof FluentSuccess) {
    return input
  }
  return isSuccess(input) ? new FluentSuccess(input.data) : new FluentFailure(input.issues)
}
