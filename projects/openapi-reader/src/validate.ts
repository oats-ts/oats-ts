import { failure, success, Try } from '@oats-ts/try'
import { DefaultConfig, Validator } from '@oats-ts/validators'
import { ReadContext, ReadInput } from './internalTypings'

export function validate<T>(input: ReadInput<T>, context: ReadContext, validator: Validator<any>): Try<void> {
  const { data, uri } = input
  if (context.cache.uriToObject.has(uri)) {
    return success(undefined)
  }
  const issues = validator(data, uri, { ...DefaultConfig, append: context.uri.append })
  return issues.length === 0 ? success(undefined) : failure(...issues)
}
