import { HeaderOptions, ParameterValue, QueryOptions } from '../types'
import { isNil } from '../utils'

export function getHeaderValue<T extends ParameterValue>(
  name: string,
  value: T | undefined,
  options: HeaderOptions<T>,
): T {
  if (!isNil(value)) {
    return value
  }
  if (!isNil(options.defaultValue)) {
    return options.defaultValue
  }
  if (!options.required) {
    return undefined
  }
  throw new TypeError(`Header "${name}" should not be ${value}`)
}
