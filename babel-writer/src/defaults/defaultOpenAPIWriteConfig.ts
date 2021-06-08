import isNil from 'lodash/isNil'
import { defaultWrite } from './defaultWrite'
import { defaultStringify } from './defaultStringify'
import { OpenAPIWriteConfig } from '../typings'

export function defaultOpenAPIWriteConfig(config: OpenAPIWriteConfig): OpenAPIWriteConfig {
  const { write, stringify } = config
  return {
    write: isNil(write) ? defaultWrite : write,
    stringify: isNil(stringify) ? defaultStringify : stringify,
  }
}
