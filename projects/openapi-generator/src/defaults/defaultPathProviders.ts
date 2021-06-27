import { resolve, join } from 'path'
import { NameProvider } from '@oats-ts/openapi-common'

export const singleFile = (path: string) => () => resolve(path)

export const byName = (path: string) => (input: any, name: NameProvider, target: string) =>
  resolve(join(path, `${name(input, target)}.ts`))
