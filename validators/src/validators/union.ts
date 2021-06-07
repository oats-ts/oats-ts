import { Validator, IssueType, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

export const union =
  (validators: Record<string, Validator<any>>): Validator<any> =>
  (input: any, config: ValidatorConfig) => {
    const keys = Object.keys(validators)
    const severity = getSeverity(IssueType.TYPE, config)

    if (isNil(severity)) {
      return []
    }

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]
      const validator = validators[key]
      // Validate only 1 level, otherwise deep issues can prevent detecting the intended type
      const children = validator(input, { ...config })
      // If one of the types validated successfully, we are good, nothing to do
      if (children.length === 0) {
        return []
      }
      // TODO collect the messages, organize them to give better reasoning for failure
    }

    return [
      {
        type: IssueType.UNION,
        message: `should be one of ${keys}`,
        path: config.path,
        severity,
      },
    ]
  }
