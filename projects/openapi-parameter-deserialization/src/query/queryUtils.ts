import { Try, failure, success } from '@oats-ts/try'
import { QueryOptions, RawQueryParams } from '../types'

export function getQueryValue(name: string, params: RawQueryParams, options: QueryOptions): Try<string | undefined> {
  const values = params[name] || []
  switch (values.length) {
    case 0: {
      if (options.required) {
        return failure([{ message: `Query parameter "${name}" is required`, path: name, severity: 'error', type: '' }])
      }
      return success(undefined)
    }
    case 1: {
      return success(values[0])
    }
    default:
      return failure([
        {
          message: `Query parameter "${name}" should occur once (found ${values.length} times in query string)`,
          path: name,
          severity: 'error',
          type: '',
        },
      ])
  }
}
