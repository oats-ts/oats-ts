import { fluent, Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, RawHeaders } from '../..//types'
import { ValueParser } from '../types'
import { createArrayParser } from '../utils'
import { getHeaderValue } from './headerUtils'

export const headerSimpleArray = <T extends Primitive>(
  parse: ValueParser<string, T>,
  options: Partial<DslConfig> = {},
) => {
  const arrayParser = createArrayParser(',', parse)
  return (data: RawHeaders, name: string, path: string, config: ValidatorConfig): Try<T[]> => {
    return fluent(getHeaderValue(name, path, data, options.required))
      .flatMap((value) => arrayParser(value, name, path, config) as Try<T[]>)
      .toTry()
  }
}
