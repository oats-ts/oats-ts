import { JSDoc, createPrinter, factory, SyntaxKind, NodeFlags } from 'typescript'

/** TODO this is a workaround as typescript currently doesn't allow adding doc comments as leading/trailing comments */
export function stringifyJSDoc(doc: JSDoc): string {
  const printer = createPrinter()
  const file = factory.createSourceFile([doc as any], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None)
  return printer
    .printFile(file)
    .trim()
    .replace(/^\/\*|\*\/$/g, '')
}
