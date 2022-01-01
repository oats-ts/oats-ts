import { fluent, Try } from '@oats-ts/try'
import { PrimitiveRecord, PathOptions, PathSerializer } from '../types'
import { entries } from '../utils'
import { joinKeyValuePairs } from './joinKeyValuePairs'
import { getPathValue, validatePathObject } from './pathUtils'

export const pathSimpleObject =
  <T extends PrimitiveRecord>(options: PathOptions<T> = {}): PathSerializer<T> =>
  (name: string, data?: T): Try<string> => {
    return fluent(getPathValue(name, data, options))
      .flatMap((value) => validatePathObject(name, value))
      .map((value) => joinKeyValuePairs('', options.explode ? '=' : ',', ',', entries(value)))
      .getPlain()
  }
