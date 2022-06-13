import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterSerializerGenerator } from '../utils/serializers/InputParameterSerializerGenerator'

export class PathSerializersGenerator extends InputParameterSerializerGenerator {
  constructor(config: Partial<GeneratorConfig>) {
    super(config, 'openapi/path-serializer', 'openapi/path-type', 'path')
  }
}
