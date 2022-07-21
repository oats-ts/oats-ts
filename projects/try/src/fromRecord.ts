import { Issue } from '@oats-ts/validators'
import { failure } from './failure'
import { isFailure } from './isFailure'
import { success } from './success'
import { Try } from './types'

export function fromRecord<K extends string | number | symbol, V>(input: Record<K, Try<V>>): Try<Record<K, V>> {
  const output = {} as Record<K, V>
  const allIssues: Issue[] = []
  const keys = Object.keys(input) as K[]
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    const value = input[key]
    if (isFailure(value)) {
      allIssues.push(...value.issues)
    } else {
      output[key] = value.data
    }
  }
  return allIssues.length === 0 ? success(output) : failure(...allIssues)
}
