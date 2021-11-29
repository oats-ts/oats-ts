import { isEmpty } from 'lodash'
import { Issue } from '@oats-ts/validators'
import { CodeGenerator } from './typings'

export function ensureDependencies(generators: CodeGenerator<any, any>[]): Issue[] {
  const issues: Issue[] = []
  for (const { consumes, id: id } of generators) {
    const consumesSet = new Set(consumes)
    for (const { id: id } of generators) {
      consumesSet.delete(id)
    }
    const notProvided = Array.from(consumesSet)
    if (!isEmpty(notProvided)) {
      issues.push({
        type: 'deps',
        message: `Following dependencies required by ${id} were not provided: [${notProvided.join(', ')}]`,
        path: id,
        severity: 'error',
      })
    }
  }
  return issues
}
