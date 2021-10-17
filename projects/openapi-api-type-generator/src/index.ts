import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ApiTypeGenerator } from './ApiTypeGenerator'
import { ApiTypeGeneratorConfig } from './typings'

export type { ApiTypeGeneratorConfig } from './typings'
export { ApiTypeGenerator } from './ApiTypeGenerator'

export function apiType(config: GeneratorConfig & ApiTypeGeneratorConfig): OpenAPIGenerator {
  return new ApiTypeGenerator(config)
}
