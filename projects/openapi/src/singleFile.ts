import { resolve } from 'path'
import { GeneratorPathProvider } from './typings'

export function singleFile(path: string): GeneratorPathProvider {
  return () => resolve(path)
}
