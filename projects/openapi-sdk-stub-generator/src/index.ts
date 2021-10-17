import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { SdkStubGenerator } from './SdkStubGenerator'
import { SdkStubGeneratorConfig } from './typings'

export type { SdkStubGeneratorConfig } from './typings'
export { SdkStubGenerator } from './SdkStubGenerator'

export function sdkStub(config: GeneratorConfig & SdkStubGeneratorConfig): OpenAPIGenerator {
  return new SdkStubGenerator(config)
}
