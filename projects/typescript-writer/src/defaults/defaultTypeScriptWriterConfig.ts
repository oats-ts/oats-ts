import { defaultWrite } from './defaultWrite'
import { TypeScriptWriterConfig } from '../typings'
import { isNil } from 'lodash'
import { defaultCommentsConfig } from './defaultCommentsConfig'

export function defaultTypeScriptWriterConfig(config: Partial<TypeScriptWriterConfig>): TypeScriptWriterConfig {
  const { write, stringify, comments } = config
  return {
    comments: defaultCommentsConfig(comments),
    write: isNil(write) ? defaultWrite : write,
    stringify,
  }
}
