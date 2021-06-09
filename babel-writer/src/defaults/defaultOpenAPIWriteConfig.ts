import isNil from 'lodash/isNil'
import { defaultWrite } from './defaultWrite'
import { defaultStringify } from './defaultStringify'
import { BabelWriterConfig } from '../typings'

export function defaultOpenAPIWriteConfig(config: BabelWriterConfig): BabelWriterConfig {
  const { write, stringify } = config
  return {
    write: isNil(write) ? defaultWrite : write,
    stringify: isNil(stringify) ? defaultStringify : stringify,
  }
}
