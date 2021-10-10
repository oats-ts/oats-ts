import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ClientSdkGenerator } from './ClientSdkGenerator'
import { ClientSdkGeneratorConfig } from './typings'

export { ClientSdkGeneratorConfig } from './typings'
export { ClientSdkGenerator } from './ClientSdkGenerator'

export function clientSdk(config: GeneratorConfig & ClientSdkGeneratorConfig): OpenAPIGenerator {
  return new ClientSdkGenerator(config)
}
