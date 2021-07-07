import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

const issueType: IssueType = 'length'

export const minLength =
  (length: number): Validator<any> =>
  (input: { length: number }, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(issueType, cfg)
    if (!isNil(severity) && input.length < length) {
      return [
        {
          type: issueType,
          message: `length should be at least ${length}`,
          path: cfg.path,
          severity,
        },
      ]
    }
    return []
  }
