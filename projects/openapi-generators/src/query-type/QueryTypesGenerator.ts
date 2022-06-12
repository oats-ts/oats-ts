import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'

export class QueryTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/query-type', 'query', config)
  }
}