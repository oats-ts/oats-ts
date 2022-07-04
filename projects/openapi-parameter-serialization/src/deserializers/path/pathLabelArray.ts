import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, PathParameterDeserializer, Primitive, RawPathParams, ValueDeserializer } from '../../types'
import { createArrayParser } from '../utils'
import { getPathValue, getPrefixedValue } from './pathUtils'

export const pathLabelArray = <T extends Primitive>(
  parse: ValueDeserializer<string, T>,
  options: Partial<DslConfig> = {},
): PathParameterDeserializer<T[]> => {
  const arrayParser = createArrayParser(options.explode ? '.' : ',', parse)
  return (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => getPrefixedValue(path, pathValue, '.'))
      .flatMap((value) => arrayParser(value, name, path, config) as Try<T[]>)
      .toTry()
  }
}
