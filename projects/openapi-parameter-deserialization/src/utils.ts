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

export const createDelimitedRecordParser =
  (location: 'path' | 'header', separator: string) =>
  (name: string, value: string): Record<string, string> => {
    const parts = value.split(separator)
    if (parts.length % 2 !== 0) {
      throw new TypeError(`Malformed value "${value}" for ${location} parameter "${name}"`)
    }
    const record: Record<string, string> = {}
    for (let i = 0; i < parts.length; i += 2) {
      const key = parts[i]
      const value = parts[i + 1]
      record[key] = value
    }
    return record
  }

export const createKeyValuePairRecordParser =
  (location: 'path' | 'header', separator: string, kvSeparator: string) =>
  (name: string, value: string): Record<string, string> => {
    const kvPairStrs = value.split(separator)
    const record: Record<string, string> = {}
    for (let i = 0; i < kvPairStrs.length; i += 1) {
      const kvPairStr = kvPairStrs[i]
      const pair = kvPairStr.split(kvSeparator)
      if (pair.length !== 2) {
        throw new TypeError(`Unexpected content "${value}" in ${location} parameter "${name}"`)
      }
      const [rawKey, rawValue] = pair
      record[rawKey] = rawValue
    }
    return record
  }

export const createArrayParser =
  (separator: string) =>
  <T extends Primitive>(name: string, value: string, parse: ValueParser<string, T>): T[] => {
    return value.split(separator).map((value, i) => parse(`${name}[${i}]`, decode(value)))
  }
