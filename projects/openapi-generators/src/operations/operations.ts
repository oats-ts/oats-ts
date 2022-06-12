import { OperationsGeneratorConfig } from './typings'
import { OperationsGenerator } from './OperationsGenerator'
import { OpenAPIGenerator } from '../types'

function defaultConfig(config: Partial<OperationsGeneratorConfig>): OperationsGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
    validate: config?.validate ?? true,
  }
}

export function operations(config: Partial<OperationsGeneratorConfig> = {}): OpenAPIGenerator {
  return new OperationsGenerator(defaultConfig(config))
}
