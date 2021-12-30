import { Issue } from '@oats-ts/validators'
import { isSuccess } from './isSuccess'
import { Try } from './types'

export function getIssues(input: Try<unknown>): Issue[] {
  if (isSuccess(input)) {
    throw new TypeError(`Can't get issues of Success (${input})`)
  }
  return input.issues
}
