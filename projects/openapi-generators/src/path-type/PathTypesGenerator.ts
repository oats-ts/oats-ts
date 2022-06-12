import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'

export class PathTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig) {
    super('openapi/path-type', 'path', config)
  }
}