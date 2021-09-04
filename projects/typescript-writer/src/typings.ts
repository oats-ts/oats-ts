import type { ImportDeclaration, Statement } from 'typescript'
import type { Module } from '@oats-ts/generator'

export type TypeScriptModule = Module<Statement, ImportDeclaration>

export type CommentType = 'jsdoc' | 'block' | 'line'

export type CommentConfig = {
  type: CommentType
  text: string
}

/** Object describing comments placed in the beginning and/or end of each file. */
export type CommentsConfig = {
  /** A list of comments placed in the beginning of each module. Could be banners, influencing linting rules, etc.  */
  leadingComments?: CommentConfig[]
  /** A list of comments placed in the end of each module. Could be banners, influencing linting rules, etc.  */
  trailingComments?: CommentConfig[]
  /** Comment line separator */
  lineSeparator?: '\n' | '\r\n'
}

/** Configuration object for writing OpenAPI generated artifacts to file. */
export type TypeScriptWriterConfig = {
  /** Optional comments placed in the beginning/end of the file */
  comments?: CommentsConfig
  /**
   * @param module A module containing ast, imports and full file path.
   * @param comments Object describing comments placed in the beginning and/or end of a file.
   * @returns The module as a source code string.
   */
  stringify(module: TypeScriptModule, comments: CommentsConfig): Promise<string>
  /**
   * Writes the given content to the given path.
   * Creating possibly missing folders is part of it's responsibilty.
   * @param path The path to write the file to.
   * @param content The contents of the file.
   */
  write?(path: string, content: string): Promise<void>
}
