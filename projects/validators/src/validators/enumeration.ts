import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

const issueType: IssueType = 'enum'

export const enumeration =
  <T>(values: T[]): Validator<any> =>
  (input: T, path: string, config: ValidatorConfig) => {
    const severity = getSeverity(issueType, config)
    if (!isNil(severity) && values.indexOf(input) < 0) {
      return [
        {
          type: issueType,
          message: `should be one of ${values}`,
          path,
          severity,
        },
      ]
    }
    return []
  }
