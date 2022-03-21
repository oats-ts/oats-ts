import { IssueTypes } from '../issueTypes'
import { Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export const literal =
  (value: string | number | boolean | null): Validator<any> =>
  (input: any, path: string, config: ValidatorConfig) => {
    const severity = isNil(config.severity) ? 'error' : config.severity(IssueTypes.value)
    if (!isNil(severity) && value !== input) {
      return [
        {
          type: IssueTypes.value,
          message: `should be ${typeof value === 'string' ? `"${value}"` : value}`,
          path,
          severity,
        },
      ]
    }
    return []
  }
