import { JsonSchemaValidatorsGenerator } from './JsonSchemaValidatorsGenerator'
import { ValidatorsGeneratorConfig } from './typings'

export type { ValidatorsGeneratorConfig } from './typings'
export { JsonSchemaValidatorsGenerator } from './JsonSchemaValidatorsGenerator'

function defaultConfig(config: Partial<ValidatorsGeneratorConfig>): ValidatorsGeneratorConfig {
  return {
    arrays: config?.arrays ?? false,
    records: config?.records ?? false,
    references: config?.references ?? true,
  }
}

export const typeValidators = (config: Partial<ValidatorsGeneratorConfig> = {}) =>
  new JsonSchemaValidatorsGenerator(defaultConfig(config))
