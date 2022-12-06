import { GeneratorConfig } from '@oats-ts/oats-ts'
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

export function typeValidators(config: Partial<ValidatorsGeneratorConfig & GeneratorConfig> = {}) {
  return new JsonSchemaValidatorsGenerator(defaultConfig(config))
}
