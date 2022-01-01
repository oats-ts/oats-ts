import { failure, success, Try } from '@oats-ts/try'
import { ParameterValue, QueryOptions } from '../types'
import { isNil } from '../utils'

export function getQueryValue<T extends ParameterValue>(
  name: string,
  value: T | undefined,
  options: QueryOptions<T>,
): Try<T> {
  if (!isNil(value)) {
    return success(value)
  }
  if (!options.required) {
    return success(undefined)
  }
  return failure([
    {
      message: `Query parameter "${name}" not be ${value}`,
      path: name,
      severity: 'error',
      type: '',
    },
  ])
}
