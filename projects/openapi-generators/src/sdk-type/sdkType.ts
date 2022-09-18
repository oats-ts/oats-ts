import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { SdkTypeGenerator } from './SdkTypeGenerator'

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

export function sdkType(config: Partial<SdkGeneratorConfig & GeneratorConfig> = {}): OpenAPIGenerator {
  return new SdkTypeGenerator(defaultConfig(config))
}
