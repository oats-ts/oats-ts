import {
  identifier,
  importDeclaration,
  ImportDeclaration,
  importSpecifier,
  stringLiteral,
} from '@oats-ts/babel-writer/node_modules/@babel/types'
import { createImportPath } from '../createImportPath'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../typings'

export function createImportDeclarations(
  fromPath: string,
  target: OpenAPIGeneratorTarget,
  referencedModel: any[],
  { accessor }: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  return referencedModel
    .map((model): [string, string] => [accessor.path(model, target), accessor.name(model, target)])
    .filter(([toPath]) => toPath !== fromPath)
    .map(([toPath, name]) =>
      importDeclaration(
        [importSpecifier(identifier(name), identifier(name))],
        stringLiteral(createImportPath(fromPath, toPath)),
      ),
    )
}
