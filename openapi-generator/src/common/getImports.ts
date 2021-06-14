import { ImportDeclaration } from '@babel/types'
import { importAst } from './babelUtils'
import { createImportPath } from './createImportPath'

export function getImports(fromPath: string, to: [string, string][]): ImportDeclaration[] {
  return to
    .filter(([toPath]) => toPath !== fromPath)
    .map(([toPath, name]) => importAst(createImportPath(fromPath, toPath), [name]))
}
