import { ResponseTypesGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ResponseTypesGenerator } from './ResponseTypesGenerator'

export { ResponseTypesGeneratorConfig } from './typings'
export { ResponseTypesGenerator } from './ResponseTypesGenerator'

export function responseTypes(config: GeneratorConfig & ResponseTypesGeneratorConfig): OpenAPIGenerator {
  return new ResponseTypesGenerator(config)
}
