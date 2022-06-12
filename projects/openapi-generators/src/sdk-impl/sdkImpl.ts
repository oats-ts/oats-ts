import { OpenAPIGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { SdkImplementationGenerator } from './SdkImplementationGenerator'

function defaultConfig(config: Partial<SdkGeneratorConfig>): SdkGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function sdkImpl(config: Partial<SdkGeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkImplementationGenerator(defaultConfig(config))
}
