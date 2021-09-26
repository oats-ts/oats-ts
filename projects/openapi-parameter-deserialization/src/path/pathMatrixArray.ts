import { Primitive, ValueParser, RawPathParams, PathOptions } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathMatrixArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): T[] => {
    if (options.explode) {
      const rawString = getPrefixedValue(name, getPathValue(name, data), ',')
      const kvPairStrings = rawString.split(';')
      return kvPairStrings.map((kvPair) => {
        const parts = kvPair.split('=')
        if (parts.length !== 2) {
          throw new TypeError(`Malformed value "${rawString}" for path parameter "${name}"`)
        }
        const [key, value] = parts.map(decode)
        if (key !== name) {
          throw new TypeError(`Malformed value "${rawString}" for path parameter "${name}"`)
        }
        return parse(name, value)
      })
    }
    return getPrefixedValue(name, getPathValue(name, data), `;${encode(name)}=`)
      .split(',')
      .map((value) => parse(name, decode(value)))
  }
