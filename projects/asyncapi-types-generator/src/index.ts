import { AsyncAPIGenerator } from '@oats-ts/asyncapi-common'
import { GeneratorConfig } from '@oats-ts/generator'
import { TypesGenerator } from './TypesGenerator'
import { TypesGeneratorConfig } from '@oats-ts/json-schema-types-generator'

export { TypesGenerator } from './TypesGenerator'

export function types(config: GeneratorConfig & TypesGeneratorConfig): AsyncAPIGenerator {
  return new TypesGenerator(config)
}
