import { Options, format } from 'prettier'
import { CommentsConfig, TypeScriptModule } from './typings'
import { factory, createPrinter, NewLineKind, SyntaxKind, NodeFlags, Statement, SourceFile } from 'typescript'
import { createCommentFactory } from './createCommentFactory'

function file(nodes: Statement[]): SourceFile {
  return factory.createSourceFile([...nodes], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None)
}

export const prettierStringify =
  (options: Options) =>
  async (data: TypeScriptModule, comments: CommentsConfig): Promise<string> => {
    const printer = createPrinter({
      newLine: NewLineKind.LineFeed,
      removeComments: false,
    })

    const { leadingComments, trailingComments, lineSeparator } = comments
    const createComment = createCommentFactory(lineSeparator)

    const asts = [
      ...(data.dependencies.length > 0 ? [file(data.dependencies)] : []),
      ...data.content.map((statement) => file([statement])),
    ]

    const printedWithComments = [
      ...leadingComments.map(createComment),
      ...asts.map((file) => format(printer.printFile(file), options)),
      ...trailingComments.map(createComment),
    ]

    return printedWithComments.join('\n')
  }
