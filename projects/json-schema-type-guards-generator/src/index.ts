import { JsonSchemaTypeGuardsGenerator } from './JsonSchemaTypeGuardsGenerator'
import { TypeGuardGeneratorConfig } from './typings'
import { isUnionTypeGuardGeneratorConfig } from './utils'

export type { FullTypeGuardGeneratorConfig, TypeGuardGeneratorConfig, UnionTypeGuardGeneratorConfig } from './typings'
export { JsonSchemaTypeGuardsGenerator } from './JsonSchemaTypeGuardsGenerator'

function defaultConfig(config: Partial<TypeGuardGeneratorConfig>): TypeGuardGeneratorConfig {
  if (isUnionTypeGuardGeneratorConfig(config)) {
    return config
  }
  return {
    arrays: config?.arrays ?? false,
    records: config?.records ?? false,
    references: config?.references ?? true,
  }
}

export const typeGuards = (config: Partial<TypeGuardGeneratorConfig> = {}) => {
  return new JsonSchemaTypeGuardsGenerator(defaultConfig(config))
}
