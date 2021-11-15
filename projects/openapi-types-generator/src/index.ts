import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { TypesGenerator } from './TypesGenerator'
import { TypesGeneratorConfig } from '@oats-ts/json-schema-types-generator'

export { TypesGenerator } from './TypesGenerator'

export function types(config: TypesGeneratorConfig): OpenAPIGenerator {
  return new TypesGenerator(config)
}
