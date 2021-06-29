import { OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ApiGenerator } from './ApiGenerator'
import { ApiGeneratorConfig } from './typings'

export { ApiGeneratorConfig } from './typings'
export { ApiGenerator } from './ApiGenerator'

export function api(config: OpenAPIGeneratorConfig & ApiGeneratorConfig): OpenAPIGenerator {
  return new ApiGenerator(config)
}
