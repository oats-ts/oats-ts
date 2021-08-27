import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'
import { ValidatorsGenerator } from './ValidatorsGenerator'

export { ValidatorsGenerator } from './ValidatorsGenerator'

export function validators(config: GeneratorConfig & ValidatorsGeneratorConfig): OpenAPIGenerator {
  return new ValidatorsGenerator(config)
}
