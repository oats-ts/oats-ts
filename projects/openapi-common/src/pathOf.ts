import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { PathProvider, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { nameOf } from './nameOf'

export function pathOf(data: OpenAPIReadOutput, config: OpenAPIGeneratorConfig): PathProvider {
  const nameProvider = nameOf(data, config)
  return function _pathOf(input: any, target: string) {
    return config.path(input, nameProvider, target)
  }
}
