import { reader } from './reader'
import { Readers } from './typings'
import { defaultReaders } from './utils/readers/defaultReaders'
import { memoryReaders } from './utils/readers/memoryReaders'

export const readers: Readers = {
  custom: reader,
  ...defaultReaders,
  memory: memoryReaders,
}
