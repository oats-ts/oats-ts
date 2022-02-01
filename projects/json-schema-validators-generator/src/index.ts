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

export const typeValidators =
  <Id extends string, C extends string>(id: Id, consumes: C) =>
  (config: Partial<ValidatorsGeneratorConfig> = {}) =>
    new JsonSchemaValidatorsGenerator(id, [consumes], defaultConfig(config))
