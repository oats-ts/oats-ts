import { Try, success, failure, isFailure, fromArray } from '@oats-ts/try'
import { Issue, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../types'
import { decode, isNil } from '../utils'

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
  (separator: string) =>
  (value: string, path: string): Try<Record<string, string>> => {
    const parts = value.split(separator)
    const issues: Issue[] = []
    if (parts.length % 2 !== 0) {
      issues.push({
        message: `malformed parameter value "${value}"`,
        path,
        severity: 'error',
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
  (separator: string, kvSeparator: string) =>
  (value: string, path: string): Try<Record<string, string>> => {
    const kvPairStrs = value.split(separator)
    const record: Record<string, string> = {}
    const issues: Issue[] = []
    for (let i = 0; i < kvPairStrs.length; i += 1) {
      const kvPairStr = kvPairStrs[i]
      const pair = kvPairStr.split(kvSeparator)
      if (pair.length !== 2) {
        issues.push({
          message: `unexpected content "${value}"`,
          path,
          severity: 'error',
        })
      }
      const [rawKey, rawValue] = pair
      record[rawKey] = rawValue
    }
    return issues.length === 0 ? success(record) : failure(issues)
  }

export const createArrayParser =
  <T extends Primitive>(separator: string, parse: ValueDeserializer<string, T>) =>
  (value: string, name: string, path: string, config: ValidatorConfig): Try<T[] | undefined> => {
    return isNil(value)
      ? success(undefined)
      : fromArray(value.split(separator).map((value, i) => parse(decode(value), name, config.append(path, i), config)))
  }
