import { Validator, ValidatorConfig } from '../typings'

export const lazy =
  <T>(producer: () => Validator<T>): Validator<T> =>
  (input: T, path: string, config: ValidatorConfig) => {
    return producer()(input, path, config)
  }
