import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterDeserializersGenerator } from '../utils/deserializers/InputParameterDeserializersGenerator'

export class PathDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor(config: Partial<GeneratorConfig>) {
    super(config, 'openapi/path-deserializer', 'openapi/path-type', 'path')
  }
}
