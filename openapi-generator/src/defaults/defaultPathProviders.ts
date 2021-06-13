import { resolve, join } from 'path'

export const singleFile = (path: string) => () => resolve(path)

export const byName = (path: string) => (input: any, name: string, target: string) => resolve(join(path, `${name}.ts`))
