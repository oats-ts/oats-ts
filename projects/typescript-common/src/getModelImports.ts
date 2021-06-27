import { ImportDeclaration } from 'typescript'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { getRelativeImports } from './getRelativeImports'

export function getModelImports(
  fromPath: string,
  target: OpenAPIGeneratorTarget,
  referencedModel: any[],
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  return getRelativeImports(
    fromPath,
    referencedModel.map((model): [string, string] => [accessor.path(model, target), accessor.name(model, target)]),
  )
}
