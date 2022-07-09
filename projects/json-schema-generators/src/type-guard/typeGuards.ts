import { GeneratorConfig } from '@oats-ts/oats-ts'
import { JsonSchemaReadOutput } from '../types'
import { JsonSchemaTypeGuardsGenerator } from './JsonSchemaTypeGuardsGenerator'
import { TypeGuardGeneratorConfig } from './typings'

function defaultConfig({
  ignore,
  ...rest
}: Partial<TypeGuardGeneratorConfig & GeneratorConfig>): TypeGuardGeneratorConfig & Partial<GeneratorConfig> {
  return {
    ignore: ignore ?? (() => false),
    ...rest,
  }
}

export function typeGuards<T extends JsonSchemaReadOutput>(config: Partial<TypeGuardGeneratorConfig> = {}) {
  return new JsonSchemaTypeGuardsGenerator<T>(defaultConfig(config))
}
