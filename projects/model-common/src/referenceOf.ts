import { CodeGenerator } from '@oats-ts/generator'

export function referenceOf(generators: CodeGenerator<any, any>[]) {
  return function _referenceOf<T>(input: any, target: string): T {
    for (const generator of generators) {
      if (generator.name() === target) {
        return generator.referenceOf(input)
      }
    }
    return undefined
  }
}
