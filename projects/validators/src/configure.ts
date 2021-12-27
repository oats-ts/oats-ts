import { Validator, ValidatorConfig } from './typings'

export const configure = <T>(config: Partial<ValidatorConfig>, validator: Validator<T>): Validator<T> => {
  return (input: T, c?: Partial<ValidatorConfig>) =>
    validator(input, c === undefined || c === null ? config : { ...config, ...c })
}
