import { PrimitiveRecord, PathOptions } from '../types'
import { entries, getPathValue } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'

export const pathLabelObject =
  <T extends PrimitiveRecord>(options: PathOptions<T>) =>
  (name: string) =>
  (data: T): string => {
    return joinKeyValuePairs('.', options.explode ? '=' : ',', ',', entries(getPathValue(name, data, options)))
  }
