import type { Validator } from '@oats-ts/validators'
import { flatMap } from 'lodash'
import { ReadContext, ReadInput } from './internalTypings'

export function validate<T>(input: ReadInput<T>, context: ReadContext, ...validators: Validator<T>[]): boolean {
  const { data, uri } = input
  const issues = flatMap(validators, (validator) => validator(data, { path: uri, append: context.uri.append }))
  context.issues.push(...issues)
  return issues.every((issue) => issue.severity !== 'error') || context.uriToObject.has(uri)
}
