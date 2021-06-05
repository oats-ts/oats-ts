import { Options, Primitive } from './types'

export function isNil(input: any): boolean {
  return input === null || input === undefined
}

export function getPrimitiveValue<T extends Primitive>(name: string, value: T, options: Options<T>): string {
  if (!isNil(value)) {
    return value.toString()
  }
  if (!isNil(options.defaultValue)) {
    return options.defaultValue.toString()
  }
  if (!options.required || options.allowEmptyValue) {
    return undefined
  }
  throw new TypeError(`parameter "${name}" should be defined`)
}

export function encode(value: string, allowReserved: boolean): string {
  if (isNil(value)) {
    return undefined
  }
  return allowReserved ? value : encodeURIComponent(value)
}
