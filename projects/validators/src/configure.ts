import { DefaultConfig, DefaultPath } from './defaults/defaults'
import { ConfiguredValidator, Validator, ValidatorConfig } from './typings'

export const configure =
  <T>(
    validator: Validator<T>,
    defaultPath: string = DefaultPath,
    defaultConfig: Partial<ValidatorConfig> = DefaultConfig,
  ): ConfiguredValidator<T> =>
  (input: T, path?: string, config?: Partial<ValidatorConfig>) =>
    validator(
      input,
      path ?? defaultPath ?? '$',
      config === undefined || config === null
        ? { ...DefaultConfig, ...defaultConfig }
        : { ...DefaultConfig, ...defaultConfig, ...config },
    )
