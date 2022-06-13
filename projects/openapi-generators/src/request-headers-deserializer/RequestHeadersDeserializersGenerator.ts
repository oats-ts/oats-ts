import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterDeserializersGenerator } from '../utils/deserializers/InputParameterDeserializersGenerator'

export class RequestHeadersDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor(config: Partial<GeneratorConfig>) {
    super(config, 'openapi/request-headers-deserializer', 'openapi/request-headers-type', 'header')
  }
}
