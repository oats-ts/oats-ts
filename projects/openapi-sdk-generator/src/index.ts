import { SdkImplementationGenerator } from './implementation/SdkImplementationGenerator'
import { SdkTypeGenerator } from './type/SdkTypeGenerator'
import { SdkGeneratorConfig } from './typings'

export type { SdkGeneratorConfig } from './typings'

export { SdkTypeGenerator } from './type/SdkTypeGenerator'
export { SdkImplementationGenerator } from './implementation/SdkImplementationGenerator'

function defaultConfig(config: Partial<SdkGeneratorConfig>): SdkGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function sdkType(config: Partial<SdkGeneratorConfig> = {}): SdkTypeGenerator {
  return new SdkTypeGenerator(defaultConfig(config))
}

export function sdkImplementation(config: Partial<SdkGeneratorConfig> = {}): SdkImplementationGenerator {
  return new SdkImplementationGenerator(defaultConfig(config))
}
