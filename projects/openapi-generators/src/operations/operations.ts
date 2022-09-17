import { OperationsGeneratorConfig } from './typings'
import { OperationsGenerator } from './OperationsGenerator'
import { OpenAPIGenerator } from '../types'
import { GeneratorConfig } from '@oats-ts/oats-ts'

function defaultConfig({
  documentation,
  validate,
  cookies,
  ...rest
}: Partial<OperationsGeneratorConfig & GeneratorConfig>): OperationsGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    validate: validate ?? true,
    cookies: cookies ?? false,
    ...rest,
  }
}

export function operations(config: Partial<OperationsGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new OperationsGenerator(defaultConfig(config))
}
