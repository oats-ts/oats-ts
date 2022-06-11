import { InputParameterDeserializersGenerator } from '../utils/deserializers/InputParameterDeserializersGenerator'

export class PathDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor() {
    super('openapi/path-deserializer', 'openapi/path-type', 'path')
  }
}
