import { Try, failure, success, fromArray, fluent } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, Primitive, PrimitiveRecord, RawQueryParams } from '../..//types'
import { FieldParsers } from '../types'
import { decode, isNil } from '../utils'

export function queryFormObjectExplode<T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: DslConfig,
  name: string,
  path: string,
  data: RawQueryParams,
  config: ValidatorConfig,
): Try<T> {
  const parserKeys = Object.keys(parsers)
  let hasKeys = false
  const keyValuePairsTry = fromArray(
    parserKeys.map((key): Try<[string, Primitive]> => {
      const parser = parsers[key as keyof T]
      const values = data[key] || []
      if (values.length > 1) {
        return failure([
          {
            message: `should have a single value (found ${values.length})`,
            path: config.append(path, key),
            severity: 'error',
            type: IssueTypes.shape,
          },
        ])
      }
      const [value] = values
      if (!isNil(value)) {
        hasKeys = true
      }
      const decodedValue = isNil(value) ? value : decode(value)
      return fluent(parser(decodedValue, key, config.append(path, key), config))
        .map((valueForKey): [string, Primitive] => [key, valueForKey])
        .toTry()
    }),
  )

  if (!hasKeys && !options.required) {
    return success(undefined!)
  }

  return fluent(keyValuePairsTry).map((keyValuePairs) => {
    const presentKvPairs = keyValuePairs.filter(([, v]) => v !== undefined)

    const output: Record<string, Primitive> = {}
    for (let i = 0; i < presentKvPairs.length; i += 1) {
      const [key, value] = presentKvPairs[i]
      output[key] = value
    }
    return (presentKvPairs.length === 0 ? {} : output) as T
  })
}
