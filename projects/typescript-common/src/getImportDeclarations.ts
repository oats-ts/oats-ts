import { ImportDeclaration, isImportDeclaration, SourceFile } from 'typescript'

export function getImportDeclarations(file: SourceFile): ImportDeclaration[] {
  return file.statements.filter((node): node is ImportDeclaration => isImportDeclaration(node))
}
