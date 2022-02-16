import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

const issueType: IssueType = 'literal'

export const literal =
  (value: string | number | boolean | null): Validator<any> =>
  (input: any, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(issueType, cfg)
    if (!isNil(severity) && value !== input) {
      return [
        {
          type: issueType,
          message: `should be ${typeof value === 'string' ? `"${value}"` : value}`,
          path: cfg.path,
          severity,
        },
      ]
    }
    return []
  }
