import { resolve, join } from 'path'
import { PathProvider, SimpleNameProvider } from '../typings'

export const singleFile = (path: string) => () => resolve(path)

export const byName =
  (path: string): PathProvider =>
  (input: any, name: SimpleNameProvider, target: string) =>
    resolve(join(path, `${name(input, target)}.ts`))
