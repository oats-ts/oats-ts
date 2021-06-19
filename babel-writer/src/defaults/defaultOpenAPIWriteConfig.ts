import { defaultWrite } from './defaultWrite'
import { BabelWriterConfig } from '../typings'
import { isNil } from 'lodash'

export function defaultOpenAPIWriteConfig(config: BabelWriterConfig): BabelWriterConfig {
  const { write, stringify } = config
  return {
    write: isNil(write) ? defaultWrite : write,
    stringify,
  }
}
