import { stringify } from './stringify'
import { defaultTypeScriptWriterConfig } from './defaults/defaultTypeScriptWriterConfig'
import { TypeScriptWriterConfig } from './typings'
import { isNil } from 'lodash'
import { SourceFile } from 'typescript'
import { fluent, fromArray, fromPromise, fromPromiseSettledResult, isFailure, success, Try } from '@oats-ts/try'
import { ContentWriter } from '@oats-ts/oats-ts'
import { WriterEventEmitter } from '@oats-ts/events'

const name = '@oats-ts/typescript-writer'

async function writeSourceFile(file: SourceFile, config: TypeScriptWriterConfig): Promise<SourceFile> {
  const source = await stringify(file, config.comments)
  const formattedSource = isNil(config.format) ? source : config.format(source)
  await config.write(file.fileName, formattedSource)
  return file
}

async function writeSourceFileWithEvents(
  file: SourceFile,
  config: TypeScriptWriterConfig,
  emitter: WriterEventEmitter<SourceFile>,
): Promise<Try<SourceFile>> {
  emitter.emit('write-file-started', {
    type: 'write-file-started',
    data: file,
  })

  const fileTry = await fromPromise(writeSourceFile(file, config))

  emitter.emit('write-file-completed', {
    type: 'write-file-completed',
    data: fileTry,
    issues: [],
  })

  return fileTry
}

export const writer =
  (config: Partial<TypeScriptWriterConfig>): ContentWriter<SourceFile> =>
  async (files: SourceFile[], emitter: WriterEventEmitter<SourceFile>): Promise<Try<SourceFile[]>> => {
    emitter.emit('writer-step-started', {
      type: 'writer-step-started',
      name,
    })

    const cfg = defaultTypeScriptWriterConfig(config)

    const output = fromArray(
      (await Promise.allSettled(files.map((file) => writeSourceFileWithEvents(file, cfg, emitter))))
        .map(fromPromiseSettledResult)
        .map((wrapped) => fluent(wrapped).flatMap((t) => t)),
    )

    emitter.emit('writer-step-completed', {
      type: 'writer-step-completed',
      data: output,
      name,
      issues: [],
    })

    return output
  }
