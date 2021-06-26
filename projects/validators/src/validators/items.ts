import { Issue, Validator, ValidatorConfig } from '../typings'
import { getConfig } from '../utils'

export const items =
  (validate: Validator<any>): Validator<any[]> =>
  (input: any[], config?: Partial<ValidatorConfig>) => {
    const cfg = getConfig(config)
    const issues: Issue[] = []
    for (let i = 0; i < input.length; i += 1) {
      issues.push(
        ...validate(input[i], {
          ...cfg,
          path: cfg.append(cfg.path, i.toString()),
        }),
      )
    }
    return issues
  }
