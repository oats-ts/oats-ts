import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { ValueParser, RawPathParams, PathOptions, Primitive, PathValueDeserializer } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelArray = <T extends Primitive>(
  parse: ValueParser<string, T>,
  options: PathOptions = {},
): PathValueDeserializer<T[]> => {
  const arrayParser = createArrayParser(options.explode ? '.' : ',', parse)
  return (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => getPrefixedValue(path, pathValue, '.'))
      .flatMap((value) => arrayParser(value, name, path, config))
      .toTry()
  }
}
