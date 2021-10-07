import { ParameterDeserializersGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ParameterDeserializersGenerator } from './ParameterDeserializersGenerator'

export { ParameterDeserializersGeneratorConfig } from './typings'
export { ParameterDeserializersGenerator } from './ParameterDeserializersGenerator'

export function parameterDeserializers(
  config: GeneratorConfig & ParameterDeserializersGeneratorConfig,
): OpenAPIGenerator {
  return new ParameterDeserializersGenerator(config)
}
