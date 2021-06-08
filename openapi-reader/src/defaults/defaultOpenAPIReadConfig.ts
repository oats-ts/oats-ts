import isNil from 'lodash/isNil'
import { OpenAPIReadConfig } from '../typings'
import { defaultResolve } from './defaultResolve'
import { DefaultURIManipulator } from './DefaultURIManipulator'

export function defaultOpenAPIReadConfig(config: OpenAPIReadConfig): OpenAPIReadConfig {
  const { resolve, path, uriManipulator } = config

  return {
    uriManipulator: isNil(uriManipulator) ? new DefaultURIManipulator() : uriManipulator,
    resolve: isNil(resolve) ? defaultResolve : resolve,
    path: path,
  }
}
