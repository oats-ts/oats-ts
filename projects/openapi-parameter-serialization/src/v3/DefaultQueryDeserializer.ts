import { Failure, failure, fluent, fromArray, fromRecord, isSuccess, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { BaseDeserializer } from './BaseDeserializer'
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
} from './types'
import { chunks, has, isNil } from './utils'

export class DefaultQueryDeserializer<T> extends BaseDeserializer implements QueryDeserializer<T> {
  constructor(protected readonly dsl: QueryDslRoot<T>) {
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
            throw unexpectedType(type, ['array'])
        }
      }
      case 'spaceDelimited': {
        switch (type) {
          case 'array':
            return this.spaceDelimitedArray(dsl, name, value, path)
          default:
            throw unexpectedType(type, ['array'])
        }
      }
      case 'deepObject': {
        switch (type) {
          case 'object':
            return this.deepObjectObject(dsl, name, value, path)
          default:
            throw unexpectedType(type, ['object'])
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
        isNil(value) ? success(undefined) : this.values.deserialize(dsl.value, this.decode(value), path),
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
    const rawValues = Object.keys(dsl.properties).map((key): [string, string[]] => [key, data[key] ?? []])

    if (!dsl.required && rawValues.filter(([_, values]) => values.length > 0).length === 0) {
      return success(undefined)
    }

    const multiValueErrors = rawValues
      .filter(([_, values]) => values.length > 1)
      .map(([key, values]) =>
        failure({
          message: `should have a single value (found ${values.length})`,
          path: this.append(path, key),
          severity: 'error',
        }),
      )

    if (multiValueErrors.length > 0) {
      return fromArray(multiValueErrors) as Failure
    }

    const record = rawValues.reduce(
      (record, [key, [value]]) => ({ ...record, [key]: isNil(value) ? value : this.decode(value) }),
      {} as Record<string, string | undefined>,
    )

    return this.keyValuePairsToObject(dsl.properties, record, path)
  }

  protected formObjectNoExplode(dsl: QueryObject, name: string, data: RawQuery, path: string): Try<PrimitiveRecord> {
    const values = data[name] || []

    if (values.length === 0) {
      return dsl.required ? failure({ message: `should be present`, path, severity: 'error' }) : success(undefined)
    } else if (values.length > 1) {
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

    const record = chunks(parts, 2).reduce<Record<string, string>>((kvRecord, [key, value]) => {
      kvRecord[this.decode(key)] = this.decode(value)
      return kvRecord
    }, {})

    return this.keyValuePairsToObject(dsl.properties, record, path, false)
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
        acc[key] = this.values.deserialize(valueDsl, this.decode(rawValue), this.append(path, key))
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
      .flatMap((values): Try<PrimitiveArray> => {
        if (isNil(values)) {
          return success(dsl.required ? [] : undefined)
        }
        return fromArray(
          values.map((value, index) =>
            this.values.deserialize(dsl.items, this.decode(value), this.append(path, index)),
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
