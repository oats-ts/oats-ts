import { BaseTypescriptWriterConfig, GeneratedFile } from './typings'
import { fileWrite, memoryWrite } from './writeFns'
import { writer } from './writer'

export const writers = {
  typescript: {
    custom: writer,
    file: (config: BaseTypescriptWriterConfig) => writer<GeneratedFile>({ ...config, write: fileWrite }),
    memory: (config: BaseTypescriptWriterConfig) => writer<GeneratedFile>({ ...config, write: memoryWrite }),
  },
} as const
