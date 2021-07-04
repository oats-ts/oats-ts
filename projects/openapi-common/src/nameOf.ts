import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { NameProvider, OpenAPIGeneratorConfig } from '@oats-ts/openapi'

export function nameOf(data: OpenAPIReadOutput, config: OpenAPIGeneratorConfig): NameProvider {
  return function _nameOf(input: any, target: string): string {
    return config.name(input, data.objectToName.get(input), target)
  }
}
