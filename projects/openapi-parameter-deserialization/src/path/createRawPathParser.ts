import { Try, failure, success } from '@oats-ts/try'
import { RawPathParams } from '../types'
import { isNil } from '../utils'

export const createRawPathParser =
  (parameterNames: string[], regex: RegExp) =>
  (path: string): Try<RawPathParams> => {
    // Regex reset just in case before
    regex.lastIndex = 0

    const values = regex.exec(path)
    if (isNil(values) || values.length !== parameterNames.length + 1) {
      return failure([
        {
          message: `Path "${path}" should have parameters ${parameterNames.map((p) => `"${p}"`).join(', ')}`,
          path: '',
          severity: 'error',
          type: '',
        },
      ])
    }

    const result: RawPathParams = {}

    for (let i = 0; i < parameterNames.length; i += 1) {
      const name = parameterNames[i]
      const value = values[i + 1]
      result[name] = value
    }
    // Regex reset after, as it can be stateful with the global flag
    regex.lastIndex = 0
    return success(result)
  }
