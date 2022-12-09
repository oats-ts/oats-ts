import { Failure, failure, fluent, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  QueryArray,
  QueryDeserializer,
  QueryParameterDescriptor,
  QueryParameters,
  QueryObject,
  QueryPrimitive,
  RawQuery,
  QuerySchema,
} from './types'
import { chunks, has, isNil } from './utils'

export class DefaultQueryDeserializer<T> extends BaseDeserializer implements QueryDeserializer<T> {
  constructor(protected readonly parameters: QueryParameters<T>) {
    super()
  }

  protected basePath(): string {
    return 'query'
  }

  public deserialize(input: string): Try<T> {
    const deserialized = fluent(this.parseRawQuery(input, this.basePath())).flatMap((raw) => {
      const parsed = Object.keys(this.parameters.descriptor).reduce(
        (acc: Record<string, Try<ParameterValue>>, key: string) => {
          const descriptor = this.parameters.descriptor[key as keyof T]
          acc[key] = this.parameter(descriptor, key, raw, this.append(this.basePath(), key))
          return acc
        },
        {},
      )
      return fromRecord(parsed)
    })
    return deserialized.toTry() as Try<T>
  }

  protected parameter(
    descriptor: QueryParameterDescriptor,
    name: string,
    value: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    if (descriptor.type === 'schema') {
      return this.schema(descriptor, name, value, path)
    }
    switch (descriptor.style) {
      case 'form': {
        switch (descriptor.type) {
          case 'primitive':
            return this.formPrimitive(descriptor, name, value, path)
          case 'array':
            return this.formArray(descriptor, name, value, path)
          case 'object':
            return this.formObject(descriptor, name, value, path)
          default: {
            throw unexpectedType((descriptor as any).type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (descriptor.type) {
          case 'array':
            return this.pipeDelimitedArray(descriptor, name, value, path)
          default:
            throw unexpectedType(descriptor.type, ['array'])
        }
      }
      case 'spaceDelimited': {
        switch (descriptor.type) {
          case 'array':
            return this.spaceDelimitedArray(descriptor, name, value, path)
          default:
            throw unexpectedType(descriptor.type, ['array'])
        }
      }
      case 'deepObject': {
        switch (descriptor.type) {
          case 'object':
            return this.deepObjectObject(descriptor, name, value, path)
          default:
            throw unexpectedType(descriptor.type, ['object'])
        }
      }
      default:
        throw unexpectedStyle(descriptor.style, ['form', 'pipeDelimited', 'spaceDelimited', 'deepObject'])
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

  protected formPrimitive(descriptor: QueryPrimitive, name: string, data: RawQuery, path: string): Try<Primitive> {
    return fluent(this.getQueryValue(descriptor, name, path, data))
      .flatMap((value) =>
        isNil(value) ? success(undefined) : this.values.deserialize(descriptor.value, this.decode(value), path),
      )
      .toTry()
  }

  protected formArray(descriptor: QueryArray, name: string, data: RawQuery, path: string): Try<PrimitiveArray> {
    return this.delimitedArray(',', descriptor, name, data, path)
  }

  protected formObject(descriptor: QueryObject, name: string, data: RawQuery, path: string): Try<ParameterValue> {
    return descriptor.explode
      ? this.formObjectExplode(descriptor, name, data, path)
      : this.formObjectNoExplode(descriptor, name, data, path)
  }

  protected formObjectExplode(
    descriptor: QueryObject,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<PrimitiveRecord> {
    const rawValues = Object.keys(descriptor.properties).map((key): [string, string[]] => [key, data[key] ?? []])

    if (!descriptor.required && rawValues.filter(([_, values]) => values.length > 0).length === 0) {
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

    return this.keyValuePairsToObject(descriptor.properties, record, path)
  }

  protected formObjectNoExplode(
    descriptor: QueryObject,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<PrimitiveRecord> {
    const values = data[name] || []

    if (values.length === 0) {
      return descriptor.required
        ? failure({ message: `should be present`, path, severity: 'error' })
        : success(undefined)
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

    return this.keyValuePairsToObject(descriptor.properties, record, path)
  }

  protected pipeDelimitedArray(
    descriptor: QueryArray,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    return this.delimitedArray('|', descriptor, name, data, path)
  }

  protected spaceDelimitedArray(
    descriptor: QueryArray,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    return this.delimitedArray(this.encode(' '), descriptor, name, data, path)
  }

  protected deepObjectObject(descriptor: QueryObject, name: string, data: RawQuery, path: string): Try<ParameterValue> {
    const parserKeys = Object.keys(descriptor.properties)
    if (parserKeys.length === 0) {
      return success({})
    }
    let hasKeys: boolean = false
    const parsed = parserKeys.reduce((acc: Record<string, Try<Primitive>>, key: string) => {
      const valueDescriptor = descriptor.properties[key]
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
        acc[key] = this.values.deserialize(valueDescriptor, this.decode(rawValue), this.append(path, key))
      }

      return acc
    }, {})
    return !hasKeys && !descriptor.required ? success(undefined) : fromRecord(parsed)
  }

  protected schema(descriptor: QuerySchema, name: string, data: RawQuery, path: string): Try<any> {
    return fluent(this.getQueryValue(descriptor, name, path, data))
      .map((value) => (isNil(value) ? value : this.decode(value)))
      .flatMap((value) => this.schemaDeserialize(descriptor, value, path))
      .flatMap((value) => this.validate(descriptor.schema, value))
  }

  protected getValues(
    descriptor: Exclude<QueryParameterDescriptor, QuerySchema>,
    delimiter: string,
    name: string,
    path: string,
    data: RawQuery,
  ) {
    if (descriptor.explode) {
      return fluent(success(data[name] ?? undefined))
    }
    return fluent(this.getQueryValue(descriptor, name, path, data)).flatMap((value) =>
      success(isNil(value) ? undefined : value.split(delimiter)),
    )
  }

  protected delimitedArray(
    delimiter: string,
    descriptor: QueryArray,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<PrimitiveArray> {
    return this.getValues(descriptor, delimiter, name, path, data)
      .flatMap((values): Try<PrimitiveArray> => {
        if (isNil(values)) {
          return success(descriptor.required ? [] : undefined)
        }
        return fromArray(
          values.map((value, index) =>
            this.values.deserialize(descriptor.items, this.decode(value), this.append(path, index)),
          ),
        )
      })
      .toTry()
  }

  protected getQueryValue(
    descriptor: QueryParameterDescriptor,
    name: string,
    path: string,
    params: RawQuery,
  ): Try<string | undefined> {
    const values = params[name] || []
    switch (values.length) {
      case 0: {
        if (descriptor.required) {
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
