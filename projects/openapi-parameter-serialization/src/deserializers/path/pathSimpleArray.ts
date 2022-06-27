import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, RawPathParams } from '../..//types'
import { ValueParser, PathValueDeserializer } from '../types'
import { createArrayParser } from '../utils'
import { getPathValue } from './pathUtils'

export const pathSimpleArray = <T extends Primitive>(
  parse: ValueParser<string, T>,
  options: Partial<DslConfig> = {},
): PathValueDeserializer<T[]> => {
  const arrayParser = createArrayParser(',', parse)
  return (data: RawPathParams, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    return fluent(getPathValue(name, path, data))
      .flatMap((pathValue) => arrayParser(pathValue, name, path, config) as Try<T[]>)
      .toTry()
  }
}
