import { Try, failure, success, fromRecord } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, ParameterValue, PrimitiveRecord, RawQueryParams } from '../..//types'
import { FieldParsers, QueryValueDeserializer } from '../types'
import { decode, encode, isNil } from '../utils'

export const queryDeepObjectObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, options: Partial<DslConfig> = {}): QueryValueDeserializer<T> =>
  (data: RawQueryParams, name: string, path: string, config: ValidatorConfig): Try<T> => {
    const parserKeys = Object.keys(parsers)
    if (parserKeys.length === 0) {
      return success({} as T)
    }
    let hasKeys: boolean = false
    const parsed = parserKeys.reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
      const parser = parsers[key as keyof T]
      const queryKey = `${encode(name)}[${encode(key)}]`
      const values = data[queryKey] || []
      if (values.length > 1) {
        acc[key] = failure([
          {
            message: `should have a single value (found ${values.length})`,
            path,
            severity: 'error',
            type: IssueTypes.shape,
          },
        ])
      } else {
        const [rawValue] = values
        if (!isNil(rawValue)) {
          hasKeys = true
        }
        acc[key] = parser(decode(rawValue), name, config.append(path, key), config)
      }

      return acc
    }, {})
    return !hasKeys && !options.required ? success(undefined!) : (fromRecord(parsed) as Try<T>)
  }
