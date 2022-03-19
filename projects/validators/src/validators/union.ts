import { Validator, IssueType, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

const issueType: IssueType = 'union'

/** TODO better way of representing the issues. */
export const union =
  (validators: Record<string, Validator<any>>): Validator<any> =>
  (input: any, path: string, config: ValidatorConfig) => {
    const keys = Object.keys(validators)
    const severity = getSeverity(issueType, config)

    if (isNil(severity)) {
      return []
    }

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const validator = validators[key]
      const children = validator(input, path, config)
      if (children.length === 0) {
        return []
      }
    }

    return [
      {
        type: issueType,
        message: `should be one of [${keys.join(', ')}]`,
        path: path,
        severity,
      },
    ]
  }
