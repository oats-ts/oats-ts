import { GeneratorConfig } from '@oats-ts/generator'
import { AsyncAPIGenerator } from '@oats-ts/asyncapi-common'
import { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'
import { ValidatorsGenerator } from './ValidatorsGenerator'

export { ValidatorsGenerator } from './ValidatorsGenerator'

export function validators(config: GeneratorConfig & ValidatorsGeneratorConfig): AsyncAPIGenerator {
  return new ValidatorsGenerator(config)
}
