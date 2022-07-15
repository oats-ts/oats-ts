import { stringify } from './stringify'
import { TypeScriptWriterConfig } from './typings'
import { isNil } from 'lodash'
import { SourceFile } from 'typescript'
import { fluent, fromArray, fromPromise, fromPromiseSettledResult, Try } from '@oats-ts/try'
import { ContentWriter, WriterEventEmitter } from '@oats-ts/oats-ts'

const name = '@oats-ts/typescript-writer'

async function writeSourceFile<O>(file: SourceFile, config: TypeScriptWriterConfig<O>): Promise<Try<O>> {
  const source = await stringify(file, config.comments)
  const formattedSource = isNil(config.format) ? source : config.format(source)
  return config.write(file.fileName, formattedSource, file)
}

async function writeSourceFileWithEvents<O>(
  file: SourceFile,
  config: TypeScriptWriterConfig,
  emitter: WriterEventEmitter<SourceFile, O>,
): Promise<Try<O>> {
  emitter.emit('write-file-started', {
    type: 'write-file-started',
    data: file,
  })

  const outputTry = fluent(await fromPromise(writeSourceFile<O>(file, config))).flatMap((nested) => nested)

  emitter.emit('write-file-completed', {
    type: 'write-file-completed',
    data: outputTry,
    issues: [],
  })

  return outputTry
}

export const writer =
  <O>(config: TypeScriptWriterConfig): ContentWriter<SourceFile, O> =>
  async (files: SourceFile[], emitter: WriterEventEmitter<SourceFile, O>): Promise<Try<O[]>> => {
    emitter.emit('writer-step-started', {
      type: 'writer-step-started',
      name,
    })

    const output = fromArray(
      (await Promise.allSettled(files.map((file) => writeSourceFileWithEvents<O>(file, config, emitter))))
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
