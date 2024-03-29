import { ImportDeclaration } from 'typescript'
import { getRelativeImports } from './getRelativeImports'

type ModelImportsContext = {
  pathOf(model: any, target?: string): string
  nameOf(model: any, target?: string): string
}

export function getModelImports<T extends string = string>(
  fromPath: string,
  target: T,
  referencedModel: any[],
  context: ModelImportsContext,
): ImportDeclaration[] {
  return getRelativeImports(
    fromPath,
    referencedModel.map((model): [string, string] => [context.pathOf(model, target), context.nameOf(model, target)]),
  )
}
