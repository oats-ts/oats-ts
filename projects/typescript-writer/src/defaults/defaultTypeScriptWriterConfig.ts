import { defaultWrite } from './defaultWrite'
import { TypeScriptWriterConfig } from '../typings'
import { isNil } from 'lodash'

export function defaultTypeScriptWriterConfig(config: TypeScriptWriterConfig): TypeScriptWriterConfig {
  const { write, stringify, purge } = config
  return {
    write: isNil(write) ? defaultWrite : write,
    stringify,
    purge: Boolean(purge),
  }
}
