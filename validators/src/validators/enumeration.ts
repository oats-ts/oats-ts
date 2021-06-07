import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

export const enumeration =
  <T>(values: T[]): Validator<any> =>
  (input: T, config: ValidatorConfig) => {
    const severity = getSeverity(IssueType.ENUM, config)
    if (!isNil(severity) && values.indexOf(input) < 0) {
      return [
        {
          type: IssueType.ENUM,
          message: `should be one of ${values}`,
          path: config.path,
          severity,
        },
      ]
    }
    return []
  }
