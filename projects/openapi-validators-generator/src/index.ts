import { OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ValidatorsGeneratorConfig } from './typings'
import { ValidatorsGenerator } from './ValidatorsGenerator'

export { ValidatorsGeneratorConfig } from './typings'
export { ValidatorsGenerator } from './ValidatorsGenerator'

export function validators(config: OpenAPIGeneratorConfig & ValidatorsGeneratorConfig): OpenAPIGenerator {
  return new ValidatorsGenerator(config)
}
