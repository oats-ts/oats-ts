import { Issue } from '@oats-ts/validators'
import { failure } from './failure'
import { isFailure } from './isFailure'
import { success } from './success'
import { Try } from './types'

export function mapArray<I, O>(input: I[], transform: (input: I, index: number, array: I[]) => Try<O>): Try<O[]> {
  const output: O[] = []
  const allIssues: Issue[] = []
  for (let i = 0; i < input.length; i += 1) {
    const result = transform(input[i], i, input)
    if (isFailure(result)) {
      allIssues.push(...result.issues)
    } else {
      output[i] = result.data
    }
  }
  return allIssues.length === 0 ? success(output) : failure(allIssues)
}
