import isNil from 'lodash/isNil'
import { defaultWrite } from './defaultWrite'
import { BabelWriterConfig } from '../typings'

export function defaultOpenAPIWriteConfig(config: BabelWriterConfig): BabelWriterConfig {
  const { write, stringify } = config
  return {
    write: isNil(write) ? defaultWrite : write,
    stringify,
  }
}
