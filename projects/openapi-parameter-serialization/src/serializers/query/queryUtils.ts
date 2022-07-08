import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { DslConfig, ParameterValue } from '../../types'
import { isNil } from '../../utils'

export function getQueryValue<T extends ParameterValue>(
  path: string,
  value: T | undefined,
  options: Partial<DslConfig>,
): Try<T> {
  if (!isNil(value)) {
    return success(value)
  }
  if (!options.required) {
    return success(undefined as unknown as T)
  }
  return failure([
    {
      message: `should not be ${value}`,
      path,
      severity: 'error',
      type: IssueTypes.value,
    },
  ])
}
