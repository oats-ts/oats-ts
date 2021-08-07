import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { PathProvider } from '@oats-ts/openapi'
import { GeneratorConfig } from '@oats-ts/generator'
import { nameOf } from './nameOf'
import { isNil } from 'lodash'

export function pathOf(data: OpenAPIReadOutput, config: GeneratorConfig): PathProvider {
  const nameProvider = nameOf(data, config)
  return function _pathOf(input: any, target: string) {
    if (isNil(config) || isNil(target)) {
      return undefined
    }
    return config.path(input, nameProvider, target)
  }
}
