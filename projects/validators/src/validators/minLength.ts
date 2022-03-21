import { IssueTypes } from '../issueTypes'
import { Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const minLength =
  (length: number): Validator<any> =>
  (input: { length: number }, path: string, config: ValidatorConfig) => {
    const severity = isNil(config.severity) ? 'error' : config.severity(IssueTypes.length)
    if (!isNil(severity) && input.length < length) {
      return [
        {
          type: IssueTypes.length,
          message: `length should be at least ${length}`,
          path,
          severity,
        },
      ]
    }
    return []
  }
