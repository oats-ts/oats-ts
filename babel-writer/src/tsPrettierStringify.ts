import { Options, format } from 'prettier'
import { TypeScriptModule } from './typings'
import { factory, createPrinter, NewLineKind, SyntaxKind, NodeFlags } from 'typescript'

export const tsPrettierStringify =
  (options: Options) =>
  async (data: TypeScriptModule): Promise<string> => {
    const printer = createPrinter({
      newLine: NewLineKind.LineFeed,
      omitTrailingSemicolon: true,
      removeComments: false,
    })
    const file = factory.createSourceFile(
      [...data.imports, ...data.statements],
      factory.createToken(SyntaxKind.EndOfFileToken),
      NodeFlags.None,
    )
    return format(printer.printFile(file), options)
  }
