import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { SdkImplementationGenerator } from './implementation/SdkImplementationGenerator'
import { SdkStubGenerator } from './stub/SdkStubGenerator'
import { SdkTypeGenerator } from './type/SdkTypeGenerator'
import { SdkGeneratorConfig } from './typings'

export type { SdkGeneratorConfig } from './typings'

export { SdkTypeGenerator } from './type/SdkTypeGenerator'
export { SdkImplementationGenerator } from './implementation/SdkImplementationGenerator'
export { SdkStubGenerator } from './stub/SdkStubGenerator'

function defaultConfig(config: Partial<SdkGeneratorConfig>): SdkGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export function sdkType(config: Partial<SdkGeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkTypeGenerator(defaultConfig(config))
}

export function sdkImplementation(config: Partial<SdkGeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkImplementationGenerator(defaultConfig(config))
}

export function sdkStub(): OpenAPIGenerator {
  return new SdkStubGenerator()
}
