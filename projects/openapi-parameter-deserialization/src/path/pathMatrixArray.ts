import { failure, fluent, fromArray, Try } from '@oats-ts/try'
import { Primitive, ValueParser, RawPathParams, PathOptions, PathValueDeserializer } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

function pathMatrixArrayExplode<T extends Primitive>(
  parse: ValueParser<string, T>,
  name: string,
  data: RawPathParams,
): Try<T[]> {
  return fluent(getPathValue(name, data))
    .flatMap((pathValue) => getPrefixedValue(name, pathValue, ';'))
    .flatMap((rawString) => {
      const parsed = rawString.split(';').map((kvPair) => {
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
      return fromArray(parsed)
    })
    .toJson()
}

function pathMatrixArrayNoExplode<T extends Primitive>(
  parse: ValueParser<string, T>,
  name: string,
  data: RawPathParams,
): Try<T[]> {
  return fluent(getPathValue(name, data))
    .flatMap((pathValue) => getPrefixedValue(name, pathValue, `;${encode(name)}=`))
    .flatMap((rawValue) => {
      return fromArray(rawValue.split(',').map((value) => parse(name, decode(value))))
    })
    .toJson()
}

export const pathMatrixArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T[]> =>
  (name: string, data: RawPathParams): Try<T[]> => {
    return options.explode ? pathMatrixArrayExplode(parse, name, data) : pathMatrixArrayNoExplode(parse, name, data)
  }
