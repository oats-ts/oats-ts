import { failure, isFailure, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'

const identity = (input: any) => input

export function entries<K extends string, V>(input: Record<K, V>): [K, V][] {
  return Object.keys(input).map((key: string) => [key as K, input[key as K] as V])
}

export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function chunks<T>(input: T[], chunkSize: 1): [T][]
export function chunks<T>(input: T[], chunkSize: 2): [T, T][]
export function chunks<T>(input: T[], chunkSize: 3): [T, T, T][]
export function chunks<T>(input: T[], chunkSize: number): T[][] {
  const output: T[][] = []
  for (let i = 0; i < input.length; i += chunkSize) {
    output.push(input.slice(i, i + chunkSize))
  }
  return output
}

export function decode(value: string): string

export function decode(value?: string): string | undefined {
  return isNil(value) ? undefined : decodeURIComponent(value)
}

export function encode(value?: string): string {
  return isNil(value)
    ? ''
    : encodeURIComponent(`${value}`).replace(
        /[\.,;=!'()*]/g,
        (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
      )
}

export function has(input: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(input, key)
}

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
    } else if (!isNil(result.data)) {
      output[key as K] = result.data
    }
  }
  return allIssues.length === 0 ? success(output) : failure(...allIssues)
}
