import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'

export class RequestHeadersTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/request-headers-type', 'header', config)
  }
}
