import { GeneratorConfig } from '@oats-ts/generator'
import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'

export class PathTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig & Partial<GeneratorConfig>) {
    super(config, 'openapi/path-type', 'path')
  }
}
