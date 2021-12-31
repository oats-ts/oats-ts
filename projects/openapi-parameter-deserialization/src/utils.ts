import { Try, success, failure, isFailure } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { Primitive, ValueParser } from './types'

export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function decode(value: string): string {
  return isNil(value) ? value : decodeURIComponent(value)
}

export function encode(value: string): string {
  return isNil(value) ? '' : encodeURIComponent(value)
}

export function has(input: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(input, key)
}

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

export const createDelimitedRecordParser =
  (location: 'path' | 'header', separator: string) =>
  (name: string, value: string): Try<Record<string, string>> => {
    const parts = value.split(separator)
    const issues: Issue[] = []
    if (parts.length % 2 !== 0) {
      issues.push({
        message: `Malformed value "${value}" for ${location} parameter "${name}"`,
        path: name,
        severity: 'error',
        type: '',
      })
    }
    const record: Record<string, string> = {}
    for (let i = 0; i < parts.length; i += 2) {
      const key = parts[i]
      const value = parts[i + 1]
      record[key] = value
    }
    return issues.length === 0 ? success(record) : failure(issues)
  }

export const createKeyValuePairRecordParser =
  (location: 'path' | 'header', separator: string, kvSeparator: string) =>
  (name: string, value: string): Try<Record<string, string>> => {
    const kvPairStrs = value.split(separator)
    const record: Record<string, string> = {}
    const issues: Issue[] = []
    for (let i = 0; i < kvPairStrs.length; i += 1) {
      const kvPairStr = kvPairStrs[i]
      const pair = kvPairStr.split(kvSeparator)
      if (pair.length !== 2) {
        issues.push({
          message: `Unexpected content "${value}" in ${location} parameter "${name}"`,
          path: name,
          severity: 'error',
          type: '',
        })
      }
      const [rawKey, rawValue] = pair
      record[rawKey] = rawValue
    }
    return issues.length === 0 ? success(record) : failure(issues)
  }

export const createArrayParser =
  (separator: string) =>
  <T extends Primitive>(name: string, value: string, parse: ValueParser<string, T>): Try<T[]> => {
    return isNil(value)
      ? success(undefined)
      : mapArray(value.split(separator), (value, i) => parse(`${name}[${i}]`, decode(value)))
  }
