import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { SdkGenerator } from './SdkGenerator'
import { SdkGeneratorConfig } from './typings'

export { SdkGeneratorConfig } from './typings'
export { SdkGenerator } from './SdkGenerator'

export function sdk(config: GeneratorConfig & SdkGeneratorConfig): OpenAPIGenerator {
  return new SdkGenerator(config)
}
