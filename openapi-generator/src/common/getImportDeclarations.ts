import { ImportDeclaration } from '@oats-ts/babel-writer/node_modules/@babel/types'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../typings'
import { getImports } from './getImports'

export function getImportDeclarations(
  fromPath: string,
  target: OpenAPIGeneratorTarget,
  referencedModel: any[],
  { accessor }: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  return getImports(
    fromPath,
    referencedModel.map((model): [string, string] => [accessor.path(model, target), accessor.name(model, target)]),
  )
}
