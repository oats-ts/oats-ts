import { failure, flatMap, mapArray, Try } from '@oats-ts/try'
import { Primitive, ValueParser, RawPathParams, PathOptions } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

function pathMatrixArrayExplode<T extends Primitive>(
  parse: ValueParser<string, T>,
  name: string,
  data: RawPathParams,
): Try<T[]> {
  return flatMap(getPathValue(name, data), (pathValue) => {
    return flatMap(getPrefixedValue(name, pathValue, ';'), (rawString) => {
      const kvPairStrings = rawString.split(';')
      return mapArray(kvPairStrings, (kvPair) => {
        const parts = kvPair.split('=')
        if (parts.length !== 2) {
          return failure([
            {
              message: `Malformed value "${rawString}" for path parameter "${name}"`,
              path: name,
              severity: 'error',
              type: '',
            },
          ])
        }
        const [key, value] = parts.map(decode)
        if (key !== name) {
          return failure([
            {
              message: `Malformed value "${rawString}" for path parameter "${name}"`,
              path: name,
              severity: 'error',
              type: '',
            },
          ])
        }
        return parse(name, value)
      })
    })
  })
}

function pathMatrixArrayNoExplode<T extends Primitive>(
  parse: ValueParser<string, T>,
  name: string,
  data: RawPathParams,
): Try<T[]> {
  return flatMap(getPathValue(name, data), (pathValue) => {
    return flatMap(getPrefixedValue(name, pathValue, `;${encode(name)}=`), (rawValue) => {
      return mapArray(rawValue.split(','), (value) => parse(name, decode(value)))
    })
  })
}

export const pathMatrixArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}) =>
  (name: string) =>
  (data: RawPathParams): Try<T[]> => {
    return options.explode ? pathMatrixArrayExplode(parse, name, data) : pathMatrixArrayNoExplode(parse, name, data)
  }
