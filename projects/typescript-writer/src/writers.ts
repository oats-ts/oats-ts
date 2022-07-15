import { BaseTypescriptWriterConfig, GeneratedFile, Writers } from './typings'
import { fileWrite } from './utils/fileWrite'
import { memoryWrite } from './utils/memoryWrite'
import { writer } from './writer'

export const writers: Writers = {
  typescript: {
    custom: writer,
    file: (config: BaseTypescriptWriterConfig) => writer<GeneratedFile>({ ...config, write: fileWrite }),
    memory: (config: BaseTypescriptWriterConfig) => writer<GeneratedFile>({ ...config, write: memoryWrite }),
  },
}
