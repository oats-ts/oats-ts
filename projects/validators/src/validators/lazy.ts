import { FullValidator, ValidatorConfig } from '../typings'

export const lazy =
  <T>(producer: () => FullValidator<T>): FullValidator<T> =>
  (input: T, path: string, config: ValidatorConfig) => {
    return producer()(input, path, config)
  }
