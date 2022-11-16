import { TypeScriptWriterConfig } from './typings'
import { SourceFile } from 'typescript'
import { ContentWriter } from '@oats-ts/oats-ts'
import { TypescriptWriter } from './TypescriptWriter'

export const writer = <O>(config: TypeScriptWriterConfig): ContentWriter<SourceFile, O> =>
  new TypescriptWriter<O>(config)
