import { SchemaObject } from '@oats-ts/openapi-reader/node_modules/openapi3-ts'
import { resolve, join } from 'path'

export const singleFile = (path: string) => () => resolve(path)

export const byName = (path: string) => (schema: SchemaObject, name: string, target: string) =>
  resolve(join(path, `${name}.ts`))
