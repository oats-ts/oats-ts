import { Try, failure, success, isSuccess, fromArray, fluent } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import {
  QueryOptions,
  PrimitiveRecord,
  FieldParsers,
  Primitive,
  RawQueryParams,
  QueryValueDeserializer,
} from '../types'
import { decode, isNil } from '../utils'

function queryFormObjectExplode<T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: QueryOptions,
  name: string,
  data: RawQueryParams,
): Try<T> {
  const parserKeys = Object.keys(parsers)
  let hasKeys = false
  const keyValuePairsTry = fromArray(
    parserKeys.map((key): Try<[string, Primitive]> => {
      const parser = parsers[key]
      const values = data[key] || []
      if (values.length > 1) {
        return failure([
          {
            message: `Expected single value for query parameter "${key}" ("${name}.${key}")`,
            path: `${name}.${key}`,
            severity: 'error',
            type: '',
          },
        ])
      }
      const [value] = values
      if (!isNil(value)) {
        hasKeys = true
      }
      const decodedValue = isNil(value) ? value : decode(value)
      return fluent(parser(key, decodedValue))
        .map((valueForKey): [string, Primitive] => [key, valueForKey])
        .toJson()
    }),
  )

  if (!hasKeys && !options.required) {
    return success(undefined)
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

function queryFormObjectNoExplode<T extends PrimitiveRecord>(
  parsers: FieldParsers<T>,
  options: QueryOptions,
  name: string,
  data: RawQueryParams,
): Try<T> {
  const output: Record<string, Primitive> = {}
  const values = data[name] || []
  switch (values.length) {
    case 0: {
      if (options.required) {
        return failure([
          {
            message: `Missing query parameter "${name}"`,
            path: name,
            severity: 'error',
            type: '',
          },
        ])
      }
      return success(undefined)
    }
    case 1:
      break
    default:
      return failure([
        {
          message: `Expected single query parameter "${name}"`,
          path: name,
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
        message: `Malformed value "${value}" for query parameter "${name}"`,
        path: name,
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
        message: `Unexpected key "${key}" in query parameter "${name}"`,
        path: name,
        severity: 'error',
        type: '',
      })
    } else {
      const parsed = parser(key, rawValue)
      if (isSuccess(parsed)) {
        output[key] = parsed.data
      } else {
        collectedIssues.push(...parsed.issues)
      }
    }
  }
  return collectedIssues.length === 0 ? success(output as T) : failure(collectedIssues)
}

export const queryFormObject =
  <T extends PrimitiveRecord>(parsers: FieldParsers<T>, opts: QueryOptions = {}): QueryValueDeserializer<T> =>
  (name: string, data: RawQueryParams): Try<T> => {
    const options: QueryOptions = { explode: true, ...opts }
    return options.explode
      ? queryFormObjectExplode(parsers, options, name, data)
      : queryFormObjectNoExplode(parsers, options, name, data)
  }
