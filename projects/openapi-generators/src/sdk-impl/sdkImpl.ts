import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { SdkImplementationGenerator } from './SdkImplementationGenerator'

function defaultConfig({
  documentation,
  ...rest
}: Partial<SdkGeneratorConfig & GeneratorConfig>): SdkGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function sdkImpl(config: Partial<SdkGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkImplementationGenerator(defaultConfig(config))
}
