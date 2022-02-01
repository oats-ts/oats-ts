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

export const typeGuards =
  <Id extends string, C extends string>(id: Id, consumes: C) =>
  (config: Partial<TypeGuardGeneratorConfig> = {}) => {
    return new JsonSchemaTypeGuardsGenerator(id, [consumes], defaultConfig(config))
  }
