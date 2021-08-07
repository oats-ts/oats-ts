import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from './typings'
import { ValidatorsGenerator } from './ValidatorsGenerator'

export { ValidatorsGeneratorConfig } from './typings'
export { ValidatorsGenerator } from './ValidatorsGenerator'

export function validators(config: GeneratorConfig & ValidatorsGeneratorConfig): OpenAPIGenerator {
  return new ValidatorsGenerator(config)
}
