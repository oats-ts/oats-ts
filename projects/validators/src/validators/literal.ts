import { IssueType, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

export const literal =
  (value: string | number | boolean): Validator<any> =>
  (input: any, config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const severity = getSeverity(IssueType.LITERAL, cfg)
    if (!isNil(severity) && value !== input) {
      return [
        {
          type: IssueType.LITERAL,
          message: `should be ${typeof value === 'string' ? `"${value}"` : value}`,
          path: cfg.path,
          severity,
        },
      ]
    }
    return []
  }
