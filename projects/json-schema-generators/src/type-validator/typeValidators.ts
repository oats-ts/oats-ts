import { GeneratorConfig } from '@oats-ts/oats-ts'
import { JsonSchemaReadOutput } from '../types'
import { JsonSchemaValidatorsGenerator } from './JsonSchemaValidatorsGenerator'
import { ValidatorsGeneratorConfig } from './typings'

function defaultConfig({
  ignore,
  ...rest
}: Partial<ValidatorsGeneratorConfig & GeneratorConfig>): ValidatorsGeneratorConfig & Partial<GeneratorConfig> {
  return {
    ignore: ignore ?? (() => false),
    ...rest,
  }
}

export function typeValidators<T extends JsonSchemaReadOutput>(
  config: Partial<ValidatorsGeneratorConfig & GeneratorConfig> = {},
) {
  return new JsonSchemaValidatorsGenerator<T>(defaultConfig(config))
}
