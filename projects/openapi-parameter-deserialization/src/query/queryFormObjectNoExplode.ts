import { Try, failure, success, isSuccess } from '@oats-ts/try'
import { Issue, ValidatorConfig } from '@oats-ts/validators'
import { QueryOptions, PrimitiveRecord, FieldParsers, Primitive, RawQueryParams } from '../types'
import { decode, isNil } from '../utils'

export function queryFormObjectNoExplode<T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: QueryOptions,
  name: string,
  path: string,
  data: RawQueryParams,
  config: ValidatorConfig,
): Try<T> {
  const output: Record<string, Primitive> = {}
  const values = data[name] || []

  // Early returns for obvious cases
  if (values.length === 0) {
    return options.required
      ? failure([
          {
            message: `should be present`,
            path,
            severity: 'error',
            type: '',
          },
        ])
      : success(undefined)
  } else if (values.length !== 1) {
    return failure([
      {
        message: `should have a single value (found ${values.length})`,
        path,
        severity: 'error',
        type: '',
      },
    ])
  }

  const [value] = values
  const parts = value.split(',')
  if (parts.length % 2 !== 0) {
    return failure([
      {
        message: `malformed parameter value "${value}"`,
        path,
        severity: 'error',
        type: '',
      },
    ])
  }
  const collectedIssues: Issue[] = []
  for (let i = 0; i < parts.length; i += 2) {
    const key = decode(parts[i])
    const rawValue = decode(parts[i + 1])
    const parser = parsers[key]
    if (isNil(parser)) {
      collectedIssues.push({
        message: `should not have "${key}"`,
        path,
        severity: 'error',
        type: '',
      })
    } else {
      const parsed = parser(rawValue, name, config.append(path, key), config)
      if (isSuccess(parsed)) {
        output[key] = parsed.data
      } else {
        collectedIssues.push(...parsed.issues)
      }
    }
  }
  return collectedIssues.length === 0 ? success(output as T) : failure(collectedIssues)
}
