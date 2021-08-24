import { isNil } from 'lodash'
import { AsyncAPIReadConfig } from '../typings'
import { defaultResolve } from './defaultResolve'
import { DefaultURIManipulator } from './DefaultURIManipulator'

export function defaultAsyncAPIReadConfig(config: AsyncAPIReadConfig): AsyncAPIReadConfig {
  const { resolve, path, uriManipulator } = config

  return {
    uriManipulator: isNil(uriManipulator) ? new DefaultURIManipulator() : uriManipulator,
    resolve: isNil(resolve) ? defaultResolve : resolve,
    path: path,
  }
}
