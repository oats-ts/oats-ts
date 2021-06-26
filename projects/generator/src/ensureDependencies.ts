import { isEmpty } from 'lodash'
import { Issue, Severity } from '@oats-ts/validators'
import { CodeGenerator } from './typings'

export function ensureDependencies(generators: CodeGenerator<any, any>[]): Issue[] {
  const issues: Issue[] = []
  for (const { consumes, id } of generators) {
    const consumesSet = new Set(consumes)
    for (const { produces } of generators) {
      for (const produced of produces) {
        consumesSet.delete(produced)
      }
    }
    const notProvided = Array.from(consumesSet)
    if (!isEmpty(notProvided)) {
      issues.push({
        type: 'deps',
        message: `Following dependencies required by ${id} were not provided: [${notProvided.join(', ')}]`,
        path: id,
        severity: Severity.ERROR,
      })
    }
  }
  return issues
}
