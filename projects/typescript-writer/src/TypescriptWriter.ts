import { ContentWriter, WriterEventEmitter } from '@oats-ts/oats-ts'
import { fluent, fromArray, fromPromise, fromPromiseSettledResult, Try } from '@oats-ts/try'
import { getImportDeclarations, getStatements } from '@oats-ts/typescript-common'
import { createPrinter, factory, NewLineKind, NodeFlags, SourceFile, Statement, SyntaxKind } from 'typescript'
import { CommentConfig, TypeScriptWriterConfig } from './typings'

export class TypescriptWriter<O> implements ContentWriter<SourceFile, O> {
  protected emitter: WriterEventEmitter<SourceFile, O> | undefined

  public constructor(private _config: TypeScriptWriterConfig) {}

  public name(): string {
    return '@oats-ts/typescript-writer'
  }

  public async write(files: SourceFile[], emitter: WriterEventEmitter<SourceFile, O>): Promise<Try<O[]>> {
    this.emitter = emitter
    this.emitter?.emit('writer-step-started', {
      type: 'writer-step-started',
      name: this.name(),
    })

    const output = fromArray(
      (await Promise.allSettled(files.map((file) => this.writeSourceFileWithEvents(file))))
        .map(fromPromiseSettledResult)
        .map((wrapped) => fluent(wrapped).flatMap((t) => t)),
    )

    this.emitter?.emit('writer-step-completed', {
      type: 'writer-step-completed',
      data: output,
      name: this.name(),
      issues: [],
    })

    return output
  }

  protected config(): TypeScriptWriterConfig {
    return this._config
  }

  protected async writeSourceFile(file: SourceFile): Promise<Try<O>> {
    const source = await this.stringify(file)
    const format = this.config().format ?? ((source: string) => source)
    const formattedSource = format(source)
    return this.config().write(file.fileName, formattedSource, file)
  }

  protected async writeSourceFileWithEvents(file: SourceFile): Promise<Try<O>> {
    this.emitter?.emit('write-file-started', {
      type: 'write-file-started',
      data: file,
    })

    const outputTry = fluent(await fromPromise(this.writeSourceFile(file))).flatMap((nested) => nested)

    this.emitter?.emit('write-file-completed', {
      type: 'write-file-completed',
      data: outputTry,
      issues: [],
    })

    return outputTry
  }

  protected async stringify(data: SourceFile): Promise<string> {
    const printer = createPrinter({
      newLine: NewLineKind.LineFeed,
      removeComments: false,
    })

    const { leadingComments = [], trailingComments = [], lineSeparator = '\n' } = this.config()?.comments ?? {}
    const imports = getImportDeclarations(data)

    const asts = [
      ...(imports.length > 0 ? [this.createDummySourceFile(imports)] : []),
      ...getStatements(data).map((statement) => this.createDummySourceFile([statement])),
    ]

    const printedWithComments = [
      ...leadingComments.map((comment) => this.createComment(lineSeparator, comment)),
      ...asts.map((file) => printer.printFile(file)),
      ...trailingComments.map((comment) => this.createComment(lineSeparator, comment)),
    ]

    return printedWithComments.join('\n')
  }

  protected createDummySourceFile(nodes: Statement[]): SourceFile {
    return factory.createSourceFile([...nodes], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None)
  }

  /*
   * Typescript doesn't have nice AST representation for comments,
   * hence the makeshift comment representation.
   */

  protected createLineComment(comment: string, lineSep: string): string {
    return comment
      .split(lineSep)
      .map((line) => `// ${line}`)
      .concat([''])
      .join(lineSep)
  }

  protected createCommonBlockComment(
    comment: string,
    lineSep: string,
    begin: string,
    lineBegin: string,
    end: string,
  ): string {
    const lines = comment.split(lineSep)
    if (lines.length === 1) {
      return `${begin} ${comment}${end}${lineSep}`
    } else {
      return [begin, ...lines.map((line) => `${lineBegin} ${line}`), end, ''].join(lineSep)
    }
  }

  protected createBlockComment(comment: string, lineSep: string): string {
    return this.createCommonBlockComment(comment, lineSep, '/*', ' *', ' */')
  }

  protected createJsDocComment(comment: string, lineSep: string): string {
    return this.createCommonBlockComment(comment, lineSep, '/**', ' *', ' */')
  }

  protected createComment(lineSep: string, comment: CommentConfig): string {
    switch (comment.type) {
      case 'line':
        return this.createLineComment(comment.text, lineSep)
      case 'block':
        return this.createBlockComment(comment.text, lineSep)
      case 'jsdoc':
        return this.createJsDocComment(comment.text, lineSep)
    }
  }
}
