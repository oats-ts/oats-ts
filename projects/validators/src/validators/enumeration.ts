import { IssueTypes } from '../issueTypes'
import { Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const enumeration =
  <T>(values: T[]): Validator<any> =>
  (input: T, path: string, config: ValidatorConfig) => {
    const severity = isNil(config.severity) ? 'error' : config.severity(IssueTypes.value)
    if (!isNil(severity) && values.indexOf(input) < 0) {
      return [
        {
          type: IssueTypes.value,
          message: `should be one of ${values}`,
          path,
          severity,
        },
      ]
    }
    return []
  }
