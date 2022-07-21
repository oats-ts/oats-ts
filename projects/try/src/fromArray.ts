import { Issue } from '@oats-ts/validators'
import { failure } from './failure'
import { isFailure } from './isFailure'
import { success } from './success'
import { Try } from './types'

export function fromArray<T>(input: Try<T>[]): Try<T[]> {
  const output: T[] = []
  const allIssues: Issue[] = []
  for (let i = 0; i < input.length; i += 1) {
    const item = input[i]
    if (isFailure(item)) {
      allIssues.push(...item.issues)
    } else {
      output[i] = item.data
    }
  }
  return allIssues.length === 0 ? success(output) : failure(...allIssues)
}
