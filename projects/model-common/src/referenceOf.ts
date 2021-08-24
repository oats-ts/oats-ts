import { isNil } from 'lodash'
import { CodeGenerator } from '@oats-ts/generator'

export function referenceOf(generators: CodeGenerator<any, any>[]) {
  return function _referenceOf<T>(input: any, target: string): T {
    for (const generator of generators) {
      const result = generator.referenceOf(input, target)
      if (!isNil(result)) {
        return result
      }
    }
    return undefined
  }
}
