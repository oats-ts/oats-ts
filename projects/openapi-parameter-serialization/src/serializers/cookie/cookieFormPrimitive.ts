import { fluent, Try } from '@oats-ts/try'
import { CookieParameterSerializer, DslConfig, Primitive } from '../../types'
import { encode, isNil } from '../../utils'
import { getCookieValue } from './cookieUtils'

export const cookieFormPrimitive =
  <T extends Primitive>(options: Partial<DslConfig> = {}): CookieParameterSerializer<T> =>
  (data: T, name: string, path: string): Try<string | undefined> => {
    return fluent(getCookieValue(path, data, options))
      .map((value) => (isNil(value) ? undefined : encode(value?.toString())))
      .toTry()
  }
