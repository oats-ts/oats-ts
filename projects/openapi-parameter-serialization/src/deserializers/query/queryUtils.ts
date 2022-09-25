import { Try, failure, success } from '@oats-ts/try'
import { DslConfig, RawQueryParams } from '../../types'

export function getQueryValue(
  name: string,
  path: string,
  params: RawQueryParams,
  options: Partial<DslConfig>,
): Try<string | undefined> {
  const values = params[name] || []
  switch (values.length) {
    case 0: {
      if (options.required) {
        return failure({
          message: 'should occur once (found 0 times)',
          path,
          severity: 'error',
        })
      }
      return success(undefined)
    }
    case 1: {
      return success(values[0])
    }
    default:
      return failure({
        message: `should occur once (found ${values.length} times)`,
        path,
        severity: 'error',
      })
  }
}
