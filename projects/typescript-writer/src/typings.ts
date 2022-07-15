import { ContentWriter } from '@oats-ts/oats-ts'
import { Try } from '@oats-ts/try'
import { SourceFile } from 'typescript'

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
export type TypeScriptWriterConfig<O = any> = BaseTypescriptWriterConfig & {
  /**
   * Writes the given content to the given path.
   * Creating possibly missing folders is part of it's responsibilty.
   * @param path The path to write the file to.
   * @param content The contents of the file.
   */
  write(path: string, content: string, file: SourceFile): Promise<Try<O>>
}

export type BaseTypescriptWriterConfig = {
  /** Optional comments placed in the beginning/end of the file */
  comments?: CommentsConfig
  /**
   * @param code The code to format
   * @returns The formatted code.
   */
  format?: (code: string) => string
}

export type GeneratedFile = {
  path: string
  content: string
}

export type Writers = {
  typescript: {
    custom: <O>(config: TypeScriptWriterConfig) => ContentWriter<SourceFile, O>
    file: (config: BaseTypescriptWriterConfig) => ContentWriter<SourceFile, GeneratedFile>
    memory: (config: BaseTypescriptWriterConfig) => ContentWriter<SourceFile, GeneratedFile>
  }
}
