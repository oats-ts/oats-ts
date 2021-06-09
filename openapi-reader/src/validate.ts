import type { Validator } from '@oats-ts/validators'
import { ReadContext, ReadInput } from './internalTypings'
import isNil from 'lodash/isNil'

export function validate<T>(input: ReadInput<T>, context: ReadContext, validator: Validator<T>): boolean {
  const { data, uri } = input
  if (isNil(validator)) {
    return true
  }
  const issues = validator(data, { path: uri, append: context.uri.append })
  context.issues.push(...issues)
  return issues.length === 0 || context.byUri.has(uri)
}
