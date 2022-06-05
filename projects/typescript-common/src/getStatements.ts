import { isImportDeclaration, SourceFile, Statement } from 'typescript'

export function getStatements(file: SourceFile): Statement[] {
  return file.statements.filter((node) => !isImportDeclaration(node))
}
