import { join, resolve } from 'path'
import { GeneratorPathProvider, NameProvider } from '@oats-ts/generator'

export function byName(path: string): GeneratorPathProvider {
  return (input: any, name: NameProvider, target: string) => resolve(join(path, `${name(input, target)}.ts`))
}
