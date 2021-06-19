import { Validator, ValidatorConfig } from '../typings'

export const lazy =
  <T>(producer: () => Validator<T>): Validator<T> =>
  (input: T, config?: Partial<ValidatorConfig>) => {
    return producer()(input, config)
  }
