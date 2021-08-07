import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ApiGenerator } from './ApiGenerator'
import { ApiGeneratorConfig } from './typings'

export { ApiGeneratorConfig } from './typings'
export { ApiGenerator } from './ApiGenerator'

export function api(config: GeneratorConfig & ApiGeneratorConfig): OpenAPIGenerator {
  return new ApiGenerator(config)
}
