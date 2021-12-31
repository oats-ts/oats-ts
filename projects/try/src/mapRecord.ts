import { Issue } from '@oats-ts/validators'
import { failure } from './failure'
import { isFailure } from './isFailure'
import { success } from './success'
import { Try } from './types'

const identity = (input: any) => input

export function mapRecord<I extends string, V>(
  input: I[],
  valueTransform: (input: I, index: number, array: I[]) => Try<V>,
): Try<Record<I, V>>

export function mapRecord<I, V, K extends string>(
  input: I[],
  valueTransform: (input: I, index: number, array: I[]) => Try<V>,
  keyTransfrom: (input: I, index: number, array: I[]) => K,
): Try<Record<K, V>>

export function mapRecord<I, V, K extends string>(
  input: I[],
  valueTransform: (input: I, index: number, array: I[]) => Try<V>,
  keyTransfrom: (input: I, index: number, array: I[]) => any = identity,
): Try<Record<K, V>> {
  const output = {} as Record<K, V>
  const allIssues: Issue[] = []
  for (let i = 0; i < input.length; i += 1) {
    const item = input[i]
    const key = keyTransfrom(item, i, input)
    const result = valueTransform(item, i, input)
    if (isFailure(result)) {
      allIssues.push(...result.issues)
    } else {
      output[key as K] = result.data
    }
  }
  return allIssues.length === 0 ? success(output) : failure(allIssues)
}
