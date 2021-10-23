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

export function sdkType(config: GeneratorConfig & SdkGeneratorConfig): OpenAPIGenerator {
  return new SdkTypeGenerator(config)
}

export function sdkImplementation(config: GeneratorConfig & SdkGeneratorConfig): OpenAPIGenerator {
  return new SdkImplementationGenerator(config)
}

export function sdkStub(config: GeneratorConfig): OpenAPIGenerator {
  return new SdkStubGenerator(config)
}
