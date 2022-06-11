import { InputParameterSerializerGenerator } from '../utils/serializers/InputParameterSerializerGenerator'

export class RequestHeadersSerializersGenerator extends InputParameterSerializerGenerator {
  constructor() {
    super('openapi/request-headers-serializer', 'openapi/request-headers-type', 'header')
  }
}
