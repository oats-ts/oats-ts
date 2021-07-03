import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

const issueType: IssueType = 'enum'

export const enumeration =
  <T>(values: T[]): Validator<any> =>
  (input: T, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(issueType, cfg)
    if (!isNil(severity) && values.indexOf(input) < 0) {
      return [
        {
          type: issueType,
          message: `should be one of ${values}`,
          path: cfg.path,
          severity,
        },
      ]
    }
    return []
  }
