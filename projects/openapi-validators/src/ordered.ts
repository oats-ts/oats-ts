import { Issue } from '@oats-ts/validators'
import { flatMap } from 'lodash'

type ParameterlessValidator = () => Issue[]

export const ordered =
  (...mandatory: ParameterlessValidator[]) =>
  (...validators: ParameterlessValidator[]): Issue[] => {
    const issues: Issue[] = []
    for (const validator of mandatory) {
      const newIssues = validator()
      issues.push(...newIssues)
      if (newIssues.some((issue) => issue.severity === 'error')) {
        return issues
      }
    }
    return [...issues, ...flatMap(validators, (validator) => validator())]
  }
