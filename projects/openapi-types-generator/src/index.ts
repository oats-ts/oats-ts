import { OpenAPIGenerator, OpenAPIGeneratorConfig } from '@oats-ts/openapi-common'
import { TypesGeneratorConfig } from './typings'
import { TypesGenerator } from './TypesGenerator'

export { TypesGeneratorConfig } from './typings'
export { TypesGenerator } from './TypesGenerator'

export function types(config: OpenAPIGeneratorConfig & TypesGeneratorConfig): OpenAPIGenerator {
  return new TypesGenerator(config)
}
