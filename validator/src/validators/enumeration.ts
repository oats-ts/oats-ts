import { Issue, IssueType, Validator, ValidatorConfig } from '../typings'

export const enumeration =
  <T>(values: T[]): Validator<any> =>
  (input: T, config: ValidatorConfig): Issue[] => {
    if (values.indexOf(input) < 0) {
      return [
        {
          type: IssueType.ENUM,
          message: `should be one of ${values}`,
          path: config.path,
        },
      ]
    }
    return []
  }
