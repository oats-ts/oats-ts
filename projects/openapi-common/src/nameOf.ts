import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { NameProvider, GeneratorConfig } from '@oats-ts/generator'
import { isNil } from 'lodash'

export function nameOf(data: OpenAPIReadOutput, config: GeneratorConfig): NameProvider {
  return function _nameOf(input: any, target?: string): string {
    if (isNil(config) || isNil(target)) {
      return data.objectToName.get(input)
    }
    return config.name(input, data.objectToName.get(input), target)
  }
}
