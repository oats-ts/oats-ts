import { TypeScriptWriterConfig } from './typings'
import { SourceFile } from 'typescript'
import { ContentWriter } from '@oats-ts/oats-ts'
import { TypescriptWriter } from './TypescriptWriter'

export function writer<O>(config: TypeScriptWriterConfig): ContentWriter<SourceFile, O> {
  return new TypescriptWriter<O>(config)
}
