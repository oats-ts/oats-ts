import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { SdkImplementationGenerator } from './SdkImplementationGenerator'

function defaultConfig({
  documentation,
  cookies,
  ...rest
}: Partial<SdkGeneratorConfig & GeneratorConfig>): SdkGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    cookies: cookies ?? false,
    ...rest,
  }
}

export function sdkImpl(config: Partial<SdkGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkImplementationGenerator(defaultConfig(config))
}
