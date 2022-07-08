import { fluent, Try } from '@oats-ts/try'
import { DslConfig, HeaderParameterSerializer, Primitive } from '../../types'
import { encode, isNil } from '../../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimplePrimitive =
  <T extends Primitive>(options: Partial<DslConfig> = {}): HeaderParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string | undefined> => {
    return fluent(getHeaderValue(path, data, options))
      .map((value) => (isNil(value) ? undefined : encode(value?.toString())))
      .toTry()
  }
