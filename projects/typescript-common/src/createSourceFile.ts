import { factory, ImportDeclaration, NodeFlags, Statement, SyntaxKind } from 'typescript'

export function createSourceFile(path: string, imports: ImportDeclaration[], statements: Statement[]) {
  const file = factory.createSourceFile(
    [...imports, ...statements],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  )
  file.fileName = path
  return file
}
