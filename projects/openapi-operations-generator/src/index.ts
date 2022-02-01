import { OperationsGeneratorConfig } from './typings'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { OperationsGenerator } from './OperationsGenerator'

export type { OperationsGeneratorConfig } from './typings'
export { OperationsGenerator } from './OperationsGenerator'

function defaultConfig(config: Partial<OperationsGeneratorConfig>): OperationsGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
    validate: config?.validate ?? true,
  }
}

export function operations(config: Partial<OperationsGeneratorConfig> = {}): OpenAPIGenerator {
  return new OperationsGenerator(defaultConfig(config))
}
