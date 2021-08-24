import { isEmpty } from 'lodash'
import { CodeGenerator } from '@oats-ts/generator'

export function dependenciesOf(generators: CodeGenerator<any, any>[]) {
  return function _dependenciesOf<T>(fromPath: string, input: any, target: string): T[] {
    for (const generator of generators) {
      const result = generator.dependenciesOf(fromPath, input, target)
      if (!isEmpty(result)) {
        return result
      }
    }
    return []
  }
}
