import { QueryOptions, ParameterValue, PathOptions } from './types'

export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function getQueryValue<T extends ParameterValue>(name: string, value: T, options: QueryOptions<T>): T {
  if (!isNil(value)) {
    return value
  }
  if (!isNil(options.defaultValue)) {
    return options.defaultValue
  }
  if (!options.required) {
    return undefined
  }
  throw new TypeError(`Query parameter "${name}" should be defined`)
}

export function getPathValue<T extends ParameterValue>(name: string, value: T, options: PathOptions<T>): T {
  if (!isNil(value)) {
    return value
  }
  if (!isNil(options.defaultValue)) {
    return options.defaultValue
  }
  throw new TypeError(`Path parameter "${name}" should be defined`)
}

export function encode<T>(value: T, allowReserved: boolean): string {
  return allowReserved ? `${value}` : encodeURIComponent(`${value}`)
}
