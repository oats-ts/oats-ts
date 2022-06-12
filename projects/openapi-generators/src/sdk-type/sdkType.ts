import { OpenAPIGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { SdkTypeGenerator } from './SdkTypeGenerator'

function defaultConfig(config: Partial<SdkGeneratorConfig>): SdkGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function sdkType(config: Partial<SdkGeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkTypeGenerator(defaultConfig(config))
}
