import { TypedValidatorConfig, Validator } from '../typings'
import { isNil } from '../utils'

export const lazy =
  <T>(producer: () => Validator<T>): Validator<T> =>
  (input: T, path: string, config: TypedValidatorConfig) => {
    if (isNil(config.severity('lazy', path))) {
      return []
    }
    return producer()(input, path, config)
  }
