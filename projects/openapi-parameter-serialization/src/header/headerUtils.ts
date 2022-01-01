import { failure, success, Try } from '@oats-ts/try'
import { HeaderOptions, ParameterValue } from '../types'
import { isNil } from '../utils'

export function getHeaderValue<T extends ParameterValue>(
  name: string,
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
      message: `Header "${name}" should not be ${value}`,
      path: name,
      severity: 'error',
      type: '',
    },
  ])
}
