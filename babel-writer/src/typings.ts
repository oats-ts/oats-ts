import type { ImportDeclaration, Statement } from '@babel/types'

/** Module (single file represented as a path and Babel AST */
export type BabelModule = {
  /** The imports. Separate field for easy access. */
  imports: ImportDeclaration[]
  /** The statements in the file. Types, functions, etc. */
  statements: Statement[]
  /** The path where the file should be generated. */
  path: string
}

/** Generator output with BabelModules */
export type BabelGeneratorOutput = {
  /** The list of modules. Producer should ensure, that paths are unique */
  modules: BabelModule[]
}

/** Configuration object for writing OpenAPI generated artifacts to file. */
export type BabelWriterConfig = {
  /**
   * @param babelModule A module containing ast, imports and full file path.
   * @returns The module as a source code string.
   */
  stringify?(babelModule: BabelModule): Promise<string>
  /**
   * Writes the given content to the given path.
   * Creating possibly missing folders is part of it's responsibilty.
   * @param path The path to write the file to.
   * @param content The contents of the file.
   */
  write?(path: string, content: string): Promise<void>
}
