import { ParameterValue, QueryOptions } from '../types'
import { isNil } from '../utils'

export function getQueryValue<T extends ParameterValue>(
  name: string,
  value: T | undefined,
  options: QueryOptions<T>,
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
  throw new TypeError(`Query parameter "${name}" not be ${value}`)
}
