import { InputParameterSerializerGenerator } from '../utils/serializers/InputParameterSerializerGenerator'

export class QuerySerializersGenerator extends InputParameterSerializerGenerator {
  constructor() {
    super('openapi/query-deserializer', 'openapi/query-type', 'query')
  }
}
