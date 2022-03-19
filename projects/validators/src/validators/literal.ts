import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

const issueType: IssueType = 'literal'

export const literal =
  (value: string | number | boolean | null): Validator<any> =>
  (input: any, path: string, config: ValidatorConfig) => {
    const severity = getSeverity(issueType, config)
    if (!isNil(severity) && value !== input) {
      return [
        {
          type: issueType,
          message: `should be ${typeof value === 'string' ? `"${value}"` : value}`,
          path,
          severity,
        },
      ]
    }
    return []
  }
