import { failure, success, Try } from '@oats-ts/try'
import { HeaderOptions, ParameterValue } from '../types'
import { isNil } from '../utils'

export function getHeaderValue<T extends ParameterValue>(
  path: string,
  value: T | undefined,
  options: HeaderOptions<T>,
): Try<T> {
  if (!isNil(value)) {
    return success(value)
  }
  if (!options.required) {
    return success(undefined)
  }
  return failure([
    {
      message: `should not be ${value}`,
      path,
      severity: 'error',
      type: '',
    },
  ])
}
