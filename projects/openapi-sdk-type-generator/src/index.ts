import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { SdkTypeGenerator } from './SdkTypeGenerator'
import { SdkTypeGeneratorConfig } from './typings'

export type { SdkTypeGeneratorConfig } from './typings'
export { SdkTypeGenerator } from './SdkTypeGenerator'

export function sdkType(config: GeneratorConfig & SdkTypeGeneratorConfig): OpenAPIGenerator {
  return new SdkTypeGenerator(config)
}
