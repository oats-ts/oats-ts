import type { ImportDeclaration, Statement } from 'typescript'
import type { Module } from '@oats-ts/generator'

export type TypeScriptModule = Module<Statement, ImportDeclaration>

/** Configuration object for writing OpenAPI generated artifacts to file. */
export type TypeScriptWriterConfig = {
  /**
   * @param babelModule A module containing ast, imports and full file path.
   * @returns The module as a source code string.
   */
  stringify(babelModule: TypeScriptModule): Promise<string>
  /**
   * Writes the given content to the given path.
   * Creating possibly missing folders is part of it's responsibilty.
   * @param path The path to write the file to.
   * @param content The contents of the file.
   */
  write?(path: string, content: string): Promise<void>

  /**
   * If set to true, parent folder of each module will be deleted.
   * This is ideal if you want to prevent keeping around stale artifacts,
   * that since have been removed from your schema.
   */
  purge?: boolean
}
