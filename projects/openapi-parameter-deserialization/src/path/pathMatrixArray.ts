import { failure, fluent, fromArray, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueParser, RawPathParams, PathOptions, PathValueDeserializer } from '../types'
import { decode, encode } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

function pathMatrixArrayExplode<T extends Primitive>(
  parse: ValueParser<string, T>,
  data: RawPathParams,
  name: string,
  path: string,
  config: ValidatorConfig,
): Try<T[]> {
  return fluent(getPathValue(name, path, data))
    .flatMap((pathValue) => getPrefixedValue(path, pathValue, ';'))
    .flatMap((rawString) => {
      const parsed = rawString.split(';').map((kvPair, index) => {
        const parts = kvPair.split('=')
        const itemPath = config.append(path, index)
        if (parts.length !== 2) {
          return failure([
            {
              message: `malformed parameter value "${rawString}"`,
              path: itemPath,
              severity: 'error',
              type: '',
            },
          ])
        }
        const [key, value] = parts.map(decode)
        if (key !== name) {
          return failure([
            {
              message: `malformed parameter value "${rawString}"`,
              path: itemPath,
              severity: 'error',
              type: '',
            },
          ])
        }
        return parse(value, name, itemPath, config)
      })
      return fromArray(parsed)
    })
    .toJson()
}

function pathMatrixArrayNoExplode<T extends Primitive>(
  parse: ValueParser<string, T>,
  data: RawPathParams,
  name: string,
  path: string,
  config: ValidatorConfig,
): Try<T[]> {
  return fluent(getPathValue(name, path, data))
    .flatMap((pathValue) => getPrefixedValue(path, pathValue, `;${encode(name)}=`))
    .flatMap((rawValue) => {
      return fromArray(
        rawValue.split(',').map((value, index) => parse(decode(value), name, config.append(path, index), config)),
      )
    })
    .toJson()
}

export const pathMatrixArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: PathOptions = {}): PathValueDeserializer<T[]> =>
  (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    const delegate = options.explode ? pathMatrixArrayExplode : pathMatrixArrayNoExplode
    return delegate(parse, data, name, path, config)
  }
