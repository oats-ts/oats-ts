import { ImportDeclaration } from 'typescript'
import { getRelativeImports } from './getRelativeImports'

type ModelImportsContext = {
  pathOf(model: any, target: string): string
  nameOf(model: any, target: string): string
}

export function getModelImports(
  fromPath: string,
  target: string,
  referencedModel: any[],
  context: ModelImportsContext,
): ImportDeclaration[] {
  const { pathOf, nameOf } = context
  return getRelativeImports(
    fromPath,
    referencedModel.map((model): [string, string] => [pathOf(model, target), nameOf(model, target)]),
  )
}
