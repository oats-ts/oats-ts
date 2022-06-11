import { InputParameterDeserializersGenerator } from '../utils/deserializers/InputParameterDeserializersGenerator'

export class QueryDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor() {
    super('openapi/query-deserializer', 'openapi/query-type', 'query')
  }
}
