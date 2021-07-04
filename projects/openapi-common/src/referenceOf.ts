import { isNil } from 'lodash'
import { OpenAPIGenerator } from './typings'

export function referenceOf(generators: OpenAPIGenerator[]) {
  return function _referenceOf<T>(input: any, target: string): T {
    for (const generator of generators) {
      if (isNil(generator.reference)) {
        continue
      }
      const result = generator.reference(input, target)
      if (!isNil(result)) {
        return result
      }
    }
    return undefined
  }
}
