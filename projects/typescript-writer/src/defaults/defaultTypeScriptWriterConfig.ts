import { defaultWrite } from './defaultWrite'
import { TypeScriptWriterConfig } from '../typings'
import { identity, isNil } from 'lodash'
import { defaultCommentsConfig } from './defaultCommentsConfig'

export function defaultTypeScriptWriterConfig(config: Partial<TypeScriptWriterConfig>): TypeScriptWriterConfig {
  const { write, comments, format } = config
  return {
    comments: defaultCommentsConfig(comments),
    write: isNil(write) ? defaultWrite : write,
    format: format ?? identity,
  }
}
