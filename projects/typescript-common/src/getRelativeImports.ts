import { getImportPath } from './getImportPath'
import { getNamedImports } from './getNamedImports'
import { ImportDeclaration } from 'typescript'

export function getRelativeImports(fromPath: string, to: [string, string][]): ImportDeclaration[] {
  return to
    .filter(([toPath]) => toPath !== fromPath)
    .map(([toPath, name]) => getNamedImports(getImportPath(fromPath, toPath), [name]))
}
