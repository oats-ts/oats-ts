import { JsonSchemaValidatorsGenerator } from './JsonSchemaValidatorsGenerator'
import { ValidatorsGeneratorConfig } from './typings'

export type { ValidatorsGeneratorConfig } from './typings'
export { JsonSchemaValidatorsGenerator } from './JsonSchemaValidatorsGenerator'

function defaultConfig(config: Partial<ValidatorsGeneratorConfig>): ValidatorsGeneratorConfig {
  return {
    ignore: config.ignore ?? (() => false),
  }
}

export const typeValidators = (config: Partial<ValidatorsGeneratorConfig> = {}) =>
  new JsonSchemaValidatorsGenerator(defaultConfig(config))
