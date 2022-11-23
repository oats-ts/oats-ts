import { failure, fluent, fromArray, fromRecord, isSuccess, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { Base } from './Base'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  QueryArray,
  QueryDeserializer,
  QueryDsl,
  QueryDslRoot,
  QueryObject,
  QueryPrimitive,
  RawQuery,
  ValueDeserializer,
} from './types'
import { has, isNil } from './utils'

export class DefaultQueryDeserializer<T> extends Base implements QueryDeserializer<T> {
  constructor(private dsl: QueryDslRoot<T>, private values: ValueDeserializer) {
    super()
  }

  protected basePath(): string {
    return 'query'
  }

  public deserialize(input: string): Try<T> {
    const deserialized = fluent(this.parseRawQuery(input, this.basePath())).flatMap((raw) => {
      const parsed = Object.keys(this.dsl.schema).reduce((acc: Record<string, Try<ParameterValue>>, key: string) => {
        const paramDsl = this.dsl.schema[key as keyof T]
        acc[key] = this.parameter(paramDsl, key, raw, this.append(this.basePath(), key))
        return acc
      }, {})
      return fromRecord(parsed)
    })
    return deserialized.toTry() as Try<T>
  }

  protected parameter(dsl: QueryDsl, name: string, value: RawQuery, path: string): Try<ParameterValue> {
    const { style, type } = dsl
    switch (style) {
      case 'form': {
        switch (type) {
          case 'primitive':
            return this.formPrimitive(dsl, name, value, path)
          case 'array':
            return this.formArray(dsl, name, value, path)
          case 'object':
            return this.formObject(dsl, name, value, path)
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (type) {
          case 'array':
            return this.pipeDelimitedArray(dsl, name, value, path)
          default:
            throw unexpectedType(type)
        }
      }
      case 'spaceDelimited': {
        switch (type) {
          case 'array':
            return this.spaceDelimitedArray(dsl, name, value, path)
          default:
            throw unexpectedType(type)
        }
      }
      case 'deepObject': {
        switch (type) {
          case 'object':
            return this.deepObjectObject(dsl, name, value, path)
          default:
            throw unexpectedType(type)
        }
      }
      default:
        throw unexpectedStyle(style, ['form', 'pipeDelimited', 'spaceDelimited', 'deepObject'])
    }
  }

  protected parseRawQuery(query: string, path: string): Try<RawQuery> {
    if (isNil(query) || query.length === 0) {
      return success({})
    }
    try {
      const sliced = query
        .slice(1) // Remove initial "?"
        .split('&') // Split key=value&key2=value2 string on "&"
        .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

      const data = sliced.reduce((record: RawQuery, [rawKey, rawValue]) => {
        const key = this.decode(rawKey)
        if (!has(record, key)) {
          record[key] = []
        }
        record[key].push(rawValue)
        return record
      }, {})

      return success(data)
    } catch (e) {
      return failure({
        message: (e as Error)?.message,
        path,
        severity: 'error',
      })
    }
  }

  protected formPrimitive(dsl: QueryPrimitive, name: string, data: RawQuery, path: string): Try<Primitive> {
    return fluent(this.getQueryValue(dsl, name, path, data))
      .flatMap((value) =>
        isNil(value) ? success(undefined) : this.values.deserialize(dsl.value, this.decode(value), name, path),
      )
      .toTry()
  }

  protected formArray(dsl: QueryArray, name: string, data: RawQuery, path: string): Try<PrimitiveArray> {
    return this.delimitedArray(',', dsl, name, data, path)
  }

  protected formObject(dsl: QueryObject, name: string, data: RawQuery, path: string): Try<ParameterValue> {
    return dsl.explode ? this.formObjectExplode(dsl, name, data, path) : this.formObjectNoExplode(dsl, name, data, path)
  }

  protected formObjectExplode(dsl: QueryObject, name: string, data: RawQuery, path: string): Try<PrimitiveRecord> {
    const parserKeys = Object.keys(dsl.properties)
    let hasKeys = false
    const keyValuePairsTry = fromArray(
      parserKeys.map((key): Try<[string, Primitive]> => {
        const parser = dsl.properties[key]
        const values = data[key] || []
        if (values.length > 1) {
          return failure({
            message: `should have a single value (found ${values.length})`,
            path: this.append(path, key),
            severity: 'error',
          })
        }
        const [value] = values
        if (!isNil(value)) {
          hasKeys = true
        }
        const decodedValue = isNil(value) ? value : this.decode(value)
        const parsedValue = this.values.deserialize(parser, decodedValue, key, this.append(path, key))
        return fluent(parsedValue)
          .map((valueForKey): [string, Primitive] => [key, valueForKey])
          .toTry()
      }),
    )

    if (!hasKeys && !dsl.required) {
      return success(undefined!)
    }

    return fluent(keyValuePairsTry).map((keyValuePairs) => {
      const presentKvPairs = keyValuePairs.filter(([, v]) => v !== undefined)

      const output: PrimitiveRecord = {}
      for (let i = 0; i < presentKvPairs.length; i += 1) {
        const [key, value] = presentKvPairs[i]
        output[key] = value
      }
      return presentKvPairs.length === 0 ? {} : output
    })
  }

  protected formObjectNoExplode(dsl: QueryObject, name: string, data: RawQuery, path: string): Try<PrimitiveRecord> {
    const output: Record<string, Primitive> = {}
    const values = data[name] || []

    // Early returns for obvious cases
    if (values.length === 0) {
      return dsl.required
        ? failure({
            message: `should be present`,
            path,
            severity: 'error',
          })
        : success(undefined!)
    } else if (values.length !== 1) {
      return failure({
        message: `should have a single value (found ${values.length})`,
        path,
        severity: 'error',
      })
    }

    const [value] = values
    const parts = value.split(',')
    if (parts.length % 2 !== 0) {
      return failure({
        message: `malformed parameter value "${value}"`,
        path,
        severity: 'error',
      })
    }
    const collectedIssues: Issue[] = []
    for (let i = 0; i < parts.length; i += 2) {
      const key = this.decode(parts[i])
      const rawValue = this.decode(parts[i + 1])
      const valueDsl = dsl.properties[key]
      if (isNil(valueDsl)) {
        collectedIssues.push({
          message: `should not have "${key}"`,
          path,
          severity: 'error',
        })
      } else {
        const parsed = this.values.deserialize(valueDsl, rawValue, name, this.append(path, key))
        if (isSuccess(parsed)) {
          output[key] = parsed.data
        } else {
          collectedIssues.push(...parsed.issues)
        }
      }
    }
    return collectedIssues.length === 0 ? success(output) : failure(...collectedIssues)
  }

  protected pipeDelimitedArray(dsl: QueryArray, name: string, data: RawQuery, path: string): Try<ParameterValue> {
    return this.delimitedArray('|', dsl, name, data, path)
  }

  protected spaceDelimitedArray(dsl: QueryArray, name: string, data: RawQuery, path: string): Try<ParameterValue> {
    return this.delimitedArray(this.encode(' '), dsl, name, data, path)
  }

  protected deepObjectObject(dsl: QueryObject, name: string, data: RawQuery, path: string): Try<ParameterValue> {
    const parserKeys = Object.keys(dsl.properties)
    if (parserKeys.length === 0) {
      return success({})
    }
    let hasKeys: boolean = false
    const parsed = parserKeys.reduce((acc: Record<string, Try<Primitive>>, key: string) => {
      const valueDsl = dsl.properties[key]
      const queryKey = `${this.encode(name)}[${this.encode(key)}]`
      const values = data[queryKey] || []
      if (values.length > 1) {
        acc[key] = failure({
          message: `should have a single value (found ${values.length})`,
          path,
          severity: 'error',
        })
      } else {
        const [rawValue] = values
        if (!isNil(rawValue)) {
          hasKeys = true
        }
        acc[key] = this.values.deserialize(valueDsl, this.decode(rawValue), name, this.append(path, key))
      }

      return acc
    }, {})
    return !hasKeys && !dsl.required ? success(undefined) : fromRecord(parsed)
  }

  protected getValues(dsl: QueryDsl, delimiter: string, name: string, path: string, data: RawQuery) {
    if (dsl.explode) {
      return fluent(success(data[name] ?? undefined))
    }
    return fluent(this.getQueryValue(dsl, name, path, data)).flatMap((value) =>
      success(isNil(value) ? undefined : value.split(delimiter)),
    )
  }

  protected delimitedArray(
    delimiter: string,
    dsl: QueryArray,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<PrimitiveArray> {
    return this.getValues(dsl, delimiter, name, path, data)
      .flatMap((values) => {
        if (isNil(values)) {
          return success(undefined)
        }
        return fromArray(
          values.map((value, index) =>
            this.values.deserialize(dsl.items, this.decode(value), name, this.append(path, index)),
          ),
        )
      })
      .toTry()
  }

  protected getQueryValue(dsl: QueryDsl, name: string, path: string, params: RawQuery): Try<string | undefined> {
    const values = params[name] || []
    switch (values.length) {
      case 0: {
        if (dsl.required) {
          return failure({
            message: 'should occur once (found 0 times)',
            path,
            severity: 'error',
          })
        }
        return success(undefined)
      }
      case 1: {
        return success(values[0])
      }
      default:
        return failure({
          message: `should occur once (found ${values.length} times)`,
          path,
          severity: 'error',
        })
    }
  }
}
