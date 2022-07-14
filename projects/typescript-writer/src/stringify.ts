import { factory, createPrinter, NewLineKind, SyntaxKind, NodeFlags, Statement, SourceFile } from 'typescript'
import { getImportDeclarations, getStatements } from '@oats-ts/typescript-common'
import { CommentsConfig } from './typings'
import { createCommentFactory } from './createCommentFactory'

function file(nodes: Statement[]): SourceFile {
  return factory.createSourceFile([...nodes], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None)
}

export const stringify = async (data: SourceFile, comments: CommentsConfig = {}): Promise<string> => {
  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
    removeComments: false,
  })

  const { leadingComments = [], trailingComments = [], lineSeparator = '\n' } = comments ?? {}
  const createComment = createCommentFactory(lineSeparator)
  const imports = getImportDeclarations(data)

  const asts = [
    ...(imports.length > 0 ? [file(imports)] : []),
    ...getStatements(data).map((statement) => file([statement])),
  ]

  const printedWithComments = [
    ...leadingComments.map(createComment),
    ...asts.map((file) => printer.printFile(file)),
    ...trailingComments.map(createComment),
  ]

  return printedWithComments.join('\n')
}
