import { DefaultConfig, DefaultPath } from './defaults'
import { Validator, FullValidator, ValidatorConfig } from './typings'

export const configure =
  <T>(
    validator: FullValidator<T>,
    defaultPath: string = DefaultPath,
    defaultConfig: Partial<ValidatorConfig> = DefaultConfig,
  ): Validator<T> =>
  (input: T, path?: string, config?: Partial<ValidatorConfig>) =>
    validator(
      input,
      path ?? defaultPath ?? '$',
      config === undefined || config === null
        ? { ...DefaultConfig, ...defaultConfig }
        : { ...DefaultConfig, ...defaultConfig, ...config },
    )
