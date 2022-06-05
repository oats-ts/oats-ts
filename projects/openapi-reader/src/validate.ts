import { DefaultConfig, Issue, Validator } from '@oats-ts/validators'
import { flatMap } from 'lodash'
import { ReadContext, ReadInput } from './internalTypings'

export function validate<T>(input: ReadInput<T>, context: ReadContext, ...validators: Validator<T>[]): Issue[] {
  const { data, uri } = input
  const issues = flatMap(validators, (validator) =>
    validator(data, uri, { ...DefaultConfig, append: context.uri.append }),
  )
  context.issues.push(...issues)

  if (context.uriToObject.has(uri)) {
    return []
  }
  return issues
}
