import { ParameterSerializersGeneratorConfig } from './typings'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { ParameterSerializersGenerator } from './ParameterSerializerGenerator'

export { ParameterSerializersGeneratorConfig } from './typings'
export { ParameterSerializersGenerator } from './ParameterSerializerGenerator'

export function parameterSerializers(config: GeneratorConfig & ParameterSerializersGeneratorConfig): OpenAPIGenerator {
  return new ParameterSerializersGenerator(config)
}
