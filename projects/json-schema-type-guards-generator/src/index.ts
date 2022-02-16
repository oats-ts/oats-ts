import { JsonSchemaTypeGuardsGenerator } from './JsonSchemaTypeGuardsGenerator'
import { TypeGuardGeneratorConfig } from './typings'

export type { TypeGuardGeneratorConfig } from './typings'
export { JsonSchemaTypeGuardsGenerator } from './JsonSchemaTypeGuardsGenerator'

function defaultConfig(config: Partial<TypeGuardGeneratorConfig>): TypeGuardGeneratorConfig {
  return {
    ignore: config.ignore ?? (() => false),
  }
}

export const typeGuards = (config: Partial<TypeGuardGeneratorConfig> = {}) => {
  return new JsonSchemaTypeGuardsGenerator(defaultConfig(config))
}
