import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdkTypings'
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

export function sdkType(config: Partial<SdkGeneratorConfig & GeneratorConfig> = {}): OpenAPICodeGenerator {
  return new SdkTypeGenerator(defaultConfig(config))
}
