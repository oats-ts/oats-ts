import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterSerializerGenerator } from '../utils/serializers/InputParameterSerializerGenerator'

export class RequestHeadersSerializersGenerator extends InputParameterSerializerGenerator {
  constructor(config: Partial<GeneratorConfig>) {
    super(config, 'openapi/request-headers-serializer', 'openapi/request-headers-type', 'header')
  }
}
