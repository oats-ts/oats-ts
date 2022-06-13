import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { SdkTypeGenerator } from './SdkTypeGenerator'

function defaultConfig({
  documentation,
  ...rest
}: Partial<SdkGeneratorConfig & GeneratorConfig>): SdkGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function sdkType(config: Partial<SdkGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkTypeGenerator(defaultConfig(config))
}
