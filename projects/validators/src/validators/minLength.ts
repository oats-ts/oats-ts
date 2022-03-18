import { IssueType, FullValidator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

const issueType: IssueType = 'length'

export const minLength =
  (length: number): FullValidator<any> =>
  (input: { length: number }, path: string, config: ValidatorConfig) => {
    const severity = getSeverity(issueType, config)
    if (!isNil(severity) && input.length < length) {
      return [
        {
          type: issueType,
          message: `length should be at least ${length}`,
          path,
          severity,
        },
      ]
    }
    return []
  }
