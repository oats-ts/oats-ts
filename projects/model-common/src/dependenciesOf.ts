import { CodeGenerator } from '@oats-ts/generator'

export function dependenciesOf(generators: CodeGenerator<any, any>[]) {
  return function _dependenciesOf<T>(fromPath: string, input: any, target: string): T[] {
    for (const generator of generators) {
      if (generator.id === target) {
        return generator.dependenciesOf(fromPath, input) ?? []
      }
    }
    return []
  }
}
