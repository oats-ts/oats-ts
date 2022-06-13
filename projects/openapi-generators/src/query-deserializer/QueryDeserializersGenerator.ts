import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterDeserializersGenerator } from '../utils/deserializers/InputParameterDeserializersGenerator'

export class QueryDeserializersGenerator extends InputParameterDeserializersGenerator {
  constructor(config: Partial<GeneratorConfig>) {
    super(config, 'openapi/query-deserializer', 'openapi/query-type', 'query')
  }
}
