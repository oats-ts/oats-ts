import { GeneratorConfig } from '@oats-ts/oats-ts'
import { InputParameterTypesGenerator } from '../utils/parameters/InputParameterTypesGenerator'
import { ParameterTypesGeneratorConfig } from '../utils/parameters/typings'

export class PathTypesGenerator extends InputParameterTypesGenerator {
  constructor(config: ParameterTypesGeneratorConfig & Partial<GeneratorConfig>) {
    super(config, 'oats/path-type', 'path')
  }
}
