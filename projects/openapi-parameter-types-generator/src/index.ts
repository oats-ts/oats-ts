import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { GeneratorConfig } from '@oats-ts/generator'
import { ParameterTypesGeneratorConfig } from './typings'
import { ParameterTypesGenerator } from './ParameterTypesGenerator'

export { ParameterTypesGeneratorConfig } from './typings'
export { ParameterTypesGenerator } from './ParameterTypesGenerator'

export function parameterTypes(config: GeneratorConfig & ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new ParameterTypesGenerator(config)
}
