import { factory, Identifier, ImportDeclaration, StringLiteral } from 'typescript'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../typings'
import { createImportPath } from './createImportPath'
import { isIdentifier } from './isIdentifier'

export function tsIdAst(input: string): Identifier | StringLiteral {
  return isIdentifier(input) ? factory.createIdentifier(input) : factory.createStringLiteral(input)
}

export function tsImportAst(from: string, names: string[]): ImportDeclaration {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        names.map((name) => factory.createImportSpecifier(undefined, factory.createIdentifier(name))),
      ),
    ),
    factory.createStringLiteral(from),
  )
}

export function tsRelativeImports(fromPath: string, to: [string, string][]): ImportDeclaration[] {
  return to
    .filter(([toPath]) => toPath !== fromPath)
    .map(([toPath, name]) => tsImportAst(createImportPath(fromPath, toPath), [name]))
}

export function tsModelImportAsts(
  fromPath: string,
  target: OpenAPIGeneratorTarget,
  referencedModel: any[],
  { accessor }: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  return tsRelativeImports(
    fromPath,
    referencedModel.map((model): [string, string] => [accessor.path(model, target), accessor.name(model, target)]),
  )
}
