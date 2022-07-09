import { GeneratorConfig } from '@oats-ts/oats-ts'
import { JsonSchemaReadOutput } from '../types'
import { JsonSchemaTypesGenerator } from './JsonSchemaTypesGenerator'
import { TypesGeneratorConfig } from './typings'

function defaultConfig({
  documentation,
  ...rest
}: Partial<TypesGeneratorConfig & GeneratorConfig>): TypesGeneratorConfig & Partial<GeneratorConfig> {
  return {
    documentation: documentation ?? true,
    ...rest,
  }
}

export function types<T extends JsonSchemaReadOutput>(config: Partial<TypesGeneratorConfig & GeneratorConfig> = {}) {
  return new JsonSchemaTypesGenerator<T>(defaultConfig(config))
}
