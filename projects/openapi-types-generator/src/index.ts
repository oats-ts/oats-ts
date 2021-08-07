import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { GeneratorConfig } from '@oats-ts/generator'
import { TypesGenerator } from './TypesGenerator'
import { TypesGeneratorConfig } from '@oats-ts/json-schema-types-generator'

export { TypesGenerator } from './TypesGenerator'

export function types(config: GeneratorConfig & TypesGeneratorConfig): OpenAPIGenerator {
  return new TypesGenerator(config)
}
