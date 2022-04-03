import { NameProvider, GeneratorConfig } from '@oats-ts/generator'
import { isNil } from 'lodash'
import { ReadOutput } from './types'

export function nameOf(data: ReadOutput<any>, config: GeneratorConfig): NameProvider {
  return function _nameOf(input: any, target?: string): string {
    if (isNil(config) || isNil(target)) {
      return data.objectToName.get(input)
    }
    return config.nameProvider(input, data.objectToName.get(input), target)
  }
}
