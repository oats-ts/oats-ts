import { fluent } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { PrimitiveArray, HeaderOptions, HeaderSerializer } from '../types'
import { encode, isNil } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimpleArray =
  <T extends PrimitiveArray>(options: HeaderOptions<T> = {}): HeaderSerializer<T> =>
  (data: T, name: string, path: string, config: ValidatorConfig) => {
    return fluent(getHeaderValue(path, data, options))
      .map((value) => {
        if (isNil(value)) {
          return undefined
        }
        // TODO do we need to encode here???
        return value
          .filter((item) => !isNil(item))
          .map((item) => encode(item))
          .join(',')
      })
      .toTry()
  }
