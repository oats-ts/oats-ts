import { OutputFile } from 'typescript'
import { BaseTypescriptWriterConfig } from './typings'
import { fileWrite, memoryWrite } from './writeFns'
import { writer } from './writer'

export const writers = {
  typescript: {
    custom: writer,
    file: (config: BaseTypescriptWriterConfig) => writer<OutputFile>({ ...config, write: fileWrite }),
    memory: (config: BaseTypescriptWriterConfig) => writer<OutputFile>({ ...config, write: memoryWrite }),
  },
} as const
