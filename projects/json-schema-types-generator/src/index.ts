import { JsonSchemaTypesGenerator } from './JsonSchemaTypesGenerator'
import { TypesGeneratorConfig } from './typings'

export type { TypesGeneratorConfig } from './typings'
export { JsonSchemaTypesGenerator } from './JsonSchemaTypesGenerator'

const DefaultConfig: TypesGeneratorConfig = { documentation: true }

function defaultConfig(config: Partial<TypesGeneratorConfig>): TypesGeneratorConfig {
  return {
    documentation: config?.documentation ?? true,
  }
}

export const types = (config: Partial<TypesGeneratorConfig> = DefaultConfig) =>
  new JsonSchemaTypesGenerator(defaultConfig(config))
