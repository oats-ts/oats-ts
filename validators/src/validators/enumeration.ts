import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

export const enumeration =
  <T>(values: T[]): Validator<any> =>
  (input: T, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(IssueType.ENUM, cfg)
    if (!isNil(severity) && values.indexOf(input) < 0) {
      return [
        {
          type: IssueType.ENUM,
          message: `should be one of ${values}`,
          path: cfg.path,
          severity,
        },
      ]
    }
    return []
  }
