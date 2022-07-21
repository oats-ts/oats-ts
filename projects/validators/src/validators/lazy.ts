import { typed } from '../typed'
import { Validator, ValidatorConfig } from '../typings'

const Type = 'lazy' as const

export const lazy = <T>(producer: () => Validator<T>) =>
  typed((input: T, path: string, config: ValidatorConfig) => {
    return producer()(input, path, config)
  }, Type)
