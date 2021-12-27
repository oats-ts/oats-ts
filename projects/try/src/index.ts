import type { Issue } from '@oats-ts/validators'

export type Success<T> = [[], T]

export type Failure = [Issue[], undefined]

export type Try<T> = Success<T> | Failure

export function success<T>(value: T): Success<T> {
  return [[], value]
}

export function failure(issues: Issue[]): Failure {
  return [issues, undefined]
}

export function isFailure(input: Try<unknown>): input is Failure {
  return input[0].length > 0
}

export function isSuccess<T>(input: Try<T>): input is Success<T> {
  return input[0].length === 0
}

export function flatMap<I, O>(input: Try<I>, transform: (input: I) => Try<O>): Try<O> {
  return isFailure(input) ? input : transform(input[1])
}

export function map<I, O>(input: Try<I>, transform: (input: I) => O): Try<O> {
  return isFailure(input) ? input : success(transform(input[1]))
}

export function mapArray<I, O>(input: I[], transform: (input: I, index: number, array: I[]) => Try<O>): Try<O[]> {
  const output: O[] = []
  const allIssues: Issue[] = []
  for (let i = 0; i < input.length; i += 1) {
    const [issues, data] = transform(input[i], i, input)
    allIssues.push(...issues)
    output[i] = data
  }
  return allIssues.length === 0 ? success(output) : failure(allIssues)
}

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
    const [issues, data] = valueTransform(item, i, input)
    allIssues.push(...issues)
    output[key as K] = data
  }
  return allIssues.length === 0 ? success(output) : failure(allIssues)
}
