import { OperationsGeneratorConfig } from './typings'
import { OperationsGenerator } from './OperationsGenerator'

function defaultConfig(config: Partial<OperationsGeneratorConfig>): OperationsGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
    validate: config?.validate ?? true,
  }
}

export function operations(config: Partial<OperationsGeneratorConfig> = {}): OperationsGenerator {
  return new OperationsGenerator(defaultConfig(config))
}
