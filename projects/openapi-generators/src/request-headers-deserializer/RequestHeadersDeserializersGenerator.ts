import { InputParameterDeserializersGenerator } from '../utils/deserializers/InputParameterDeserializersGenerator'

export class RequestHeadersDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor() {
    super('openapi/request-headers-deserializer', 'openapi/request-headers-type', 'header')
  }
}
