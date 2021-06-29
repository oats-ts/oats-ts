import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { ParameterTypesGeneratorConfig } from './typings'
import { ParameterTypesGenerator } from './ParameterTypesGenerator'

export { ParameterTypesGeneratorConfig } from './typings'
export { ParameterTypesGenerator } from './ParameterTypesGenerator'

export function parameterTypes(config: OpenAPIGeneratorConfig & ParameterTypesGeneratorConfig): OpenAPIGenerator {
  return new ParameterTypesGenerator(config)
}
