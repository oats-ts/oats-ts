import { isEmpty } from 'lodash'
import { OpenAPIGenerator } from './typings'

export function dependenciesOf(generators: OpenAPIGenerator[]) {
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
