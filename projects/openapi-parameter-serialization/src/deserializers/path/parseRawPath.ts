import { Try, failure, success } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { RawPathParams } from '../../types'
import { isNil } from '../../utils'

export function parseRawPath(
  parameterNames: string[],
  regex: RegExp,
  pathValue: string,
  path: string,
): Try<RawPathParams> {
  // Regex reset just in case before
  regex.lastIndex = 0

  const values = regex.exec(pathValue)
  if (isNil(values) || values.length !== parameterNames.length + 1) {
    return failure([
      {
        message: `should have parameters ${parameterNames.map((p) => `"${p}"`).join(', ')}`,
        path,
        severity: 'error',
        type: IssueTypes.value,
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
