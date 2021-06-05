import { Options, ParameterValue, Primitive } from './types'

export function isNil(input: any): input is null | undefined {
  return input === null || input === undefined
}

export function entries(input: object): [string, any][] {
  return Object.keys(input).map((key: string) => [key, (input as any)[key]])
}

export function getValue<T extends ParameterValue>(name: string, value: T, options: Options<T>): T {
  if (!isNil(value)) {
    return value
  }
  if (!isNil(options.defaultValue)) {
    return options.defaultValue
  }
  if (!options.required) {
    return undefined
  }
  throw new TypeError(`parameter "${name}" should be defined`)
}

export function encode<T>(value: T, allowReserved: boolean): string {
  if (isNil(value)) {
    return undefined
  }
  return allowReserved ? `${value}` : encodeURIComponent(`${value}`)
}
