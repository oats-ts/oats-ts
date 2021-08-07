import { resolve } from 'path'
import { GeneratorPathProvider } from '@oats-ts/generator'

export function singleFile(path: string): GeneratorPathProvider {
  return () => resolve(path)
}
