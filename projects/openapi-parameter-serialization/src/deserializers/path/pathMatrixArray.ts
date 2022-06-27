import { failure, fluent, fromArray, Try } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, RawPathParams } from '../..//types'
import { ValueParser, PathValueDeserializer } from '../types'
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
              type: IssueTypes.value,
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
              type: IssueTypes.value,
            },
          ])
        }
        return parse(value, name, itemPath, config)
      })
      return fromArray(parsed)
    })
    .toTry()
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
    .toTry()
}

export const pathMatrixArray =
  <T extends Primitive>(parse: ValueParser<string, T>, options: Partial<DslConfig> = {}): PathValueDeserializer<T[]> =>
  (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    const delegate = options.explode ? pathMatrixArrayExplode : pathMatrixArrayNoExplode
    return delegate(parse, data, name, path, config)
  }
