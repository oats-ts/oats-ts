import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterSerializerGenerator } from '../utils/serializers/InputParameterSerializerGenerator'

export class QuerySerializersGenerator extends InputParameterSerializerGenerator {
  constructor(config: Partial<GeneratorConfig>) {
    super(config, 'openapi/query-serializer', 'openapi/query-type', 'query')
  }
}
