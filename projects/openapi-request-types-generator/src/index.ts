import { RequestTypesGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { RequestTypesGenerator } from './RequestTypesGenerator'

export { RequestTypesGeneratorConfig } from './typings'
export { RequestTypesGenerator } from './RequestTypesGenerator'

export function requestTypes(config: GeneratorConfig & RequestTypesGeneratorConfig): OpenAPIGenerator {
  return new RequestTypesGenerator(config)
}
