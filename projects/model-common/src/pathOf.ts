import { GeneratorConfig } from '@oats-ts/generator'
import { nameOf } from './nameOf'
import { isNil } from 'lodash'
import { ReadOutput } from './types'

export function pathOf(data: ReadOutput<any>, config: GeneratorConfig) {
  const nameProvider = nameOf(data, config)
  return function _pathOf(input: any, target: string) {
    if (isNil(config) || isNil(target)) {
      return undefined
    }
    return config.path(input, nameProvider, target)
  }
}
