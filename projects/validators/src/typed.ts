import { Validator, ValidatorConfig, ValidatorFn } from './typings'
import { isNil } from './utils'

export function typed<I, T extends string = string>(fn: ValidatorFn<I>, type: T): Validator<I, T> {
  const typedFn: Validator<I, T> = (input: I, path: string, config: ValidatorConfig) => {
    if (isNil(config.severity(type))) {
      return []
    }
    return fn(input, path, config)
  }
  typedFn.type = type
  return typedFn
}
