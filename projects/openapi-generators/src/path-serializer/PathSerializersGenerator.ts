import { InputParameterSerializerGenerator } from '../utils/serializers/InputParameterSerializerGenerator'

export class PathSerializersGenerator extends InputParameterSerializerGenerator {
  constructor() {
    super('openapi/path-serializer', 'openapi/path-type', 'path')
  }
}
