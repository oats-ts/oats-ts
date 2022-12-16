import {
  ArrayParameterRule,
  MimeTypeParameterRule,
  ObjectParameterRule,
  PrimitiveParameterRule,
  QueryDescriptorRule,
  QueryParameterRule,
} from '@oats-ts/rules'
import { Failure, failure, fluent, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, PrimitiveArray, PrimitiveRecord, QueryDeserializer, RawQuery } from './types'
import { chunks, has, isNil } from './utils'

export class DefaultQueryDeserializer<T> extends BaseDeserializer implements QueryDeserializer<T> {
  constructor(protected readonly parameters: QueryDescriptorRule<T>) {
    super()
  }

  protected basePath(): string {
    return 'query'
  }

  public deserialize(input: string): Try<T> {
    return fluent(this.parseRawQuery(input, this.basePath()))
      .flatMap((raw) => {
        const parsed = Object.keys(this.parameters.parameters).reduce(
          (acc: Record<string, Try<ParameterValue>>, key: string) => {
            const descriptor = this.parameters.parameters[key as keyof T]
            acc[key] = this.parameter(descriptor, key, raw, this.append(this.basePath(), key))
            return acc
          },
          {},
        )
        return fromRecord(parsed)
      })
      .flatMap((value) => this.validate<T>(this.parameters.schema, value, this.basePath()))
      .toTry()
  }

  protected parameter(
    descriptor: QueryParameterRule,
    name: string,
    value: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    if (descriptor.structure.type === 'mime-type') {
      return this.schema(descriptor as QueryParameterRule<MimeTypeParameterRule>, name, value, path)
    }
    switch (descriptor.style) {
      case 'form': {
        switch (descriptor.structure.type) {
          case 'primitive':
            return this.formPrimitive(descriptor as QueryParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.formArray(descriptor as QueryParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.formObject(descriptor as QueryParameterRule<ObjectParameterRule>, name, value, path)
          default: {
            throw unexpectedType((descriptor as QueryParameterRule).structure.type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (descriptor.structure.type) {
          case 'array':
            return this.pipeDelimitedArray(descriptor as QueryParameterRule<ArrayParameterRule>, name, value, path)
          default:
            throw unexpectedType(descriptor.structure.type, ['array'])
        }
      }
      case 'spaceDelimited': {
        switch (descriptor.structure.type) {
          case 'array':
            return this.spaceDelimitedArray(descriptor as QueryParameterRule<ArrayParameterRule>, name, value, path)
          default:
            throw unexpectedType(descriptor.structure.type, ['array'])
        }
      }
      case 'deepObject': {
        switch (descriptor.structure.type) {
          case 'object':
            return this.deepObjectObject(descriptor as QueryParameterRule<ObjectParameterRule>, name, value, path)
          default:
            throw unexpectedType(descriptor.structure.type, ['object'])
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

  protected formPrimitive(
    descriptor: QueryParameterRule<PrimitiveParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<Primitive> {
    return fluent(this.getQueryValue(descriptor, name, path, data))
      .flatMap((value) =>
        isNil(value)
          ? success(undefined)
          : this.values.deserialize(descriptor.structure.value, this.decode(value), path),
      )
      .toTry()
  }

  protected formArray(
    descriptor: QueryParameterRule<ArrayParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<PrimitiveArray> {
    return this.delimitedArray(',', descriptor, name, data, path)
  }

  protected formObject(
    descriptor: QueryParameterRule<ObjectParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    return descriptor.explode
      ? this.formObjectExplode(descriptor, name, data, path)
      : this.formObjectNoExplode(descriptor, name, data, path)
  }

  protected formObjectExplode(
    descriptor: QueryParameterRule<ObjectParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<PrimitiveRecord> {
    const rawValues = Object.keys(descriptor.structure.properties).map((key): [string, string[]] => [
      key,
      data[key] ?? [],
    ])

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

    return this.keyValuePairsToObject(descriptor.structure.properties, record, path)
  }

  protected formObjectNoExplode(
    descriptor: QueryParameterRule<ObjectParameterRule>,
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

    return this.keyValuePairsToObject(descriptor.structure.properties, record, path)
  }

  protected pipeDelimitedArray(
    descriptor: QueryParameterRule<ArrayParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    return this.delimitedArray('|', descriptor, name, data, path)
  }

  protected spaceDelimitedArray(
    descriptor: QueryParameterRule<ArrayParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    return this.delimitedArray(this.encode(' '), descriptor, name, data, path)
  }

  protected deepObjectObject(
    descriptor: QueryParameterRule<ObjectParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<ParameterValue> {
    const parserKeys = Object.keys(descriptor.structure.properties)
    if (parserKeys.length === 0) {
      return success({})
    }
    let hasKeys: boolean = false
    const parsed = parserKeys.reduce((acc: Record<string, Try<Primitive>>, key: string) => {
      const valueDescriptor = descriptor.structure.properties[key]
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

  protected schema(
    descriptor: QueryParameterRule<MimeTypeParameterRule>,
    name: string,
    data: RawQuery,
    path: string,
  ): Try<any> {
    return fluent(this.getQueryValue(descriptor, name, path, data))
      .map((value) => (isNil(value) ? value : this.decode(value)))
      .flatMap((value) => this.schemaDeserialize(descriptor.structure, value, path))
  }

  protected getValues(
    descriptor: Exclude<QueryParameterRule, QueryParameterRule<MimeTypeParameterRule>>,
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
    descriptor: QueryParameterRule<ArrayParameterRule>,
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
            this.values.deserialize(descriptor.structure.items, this.decode(value), this.append(path, index)),
          ),
        )
      })
      .toTry()
  }

  protected getQueryValue(
    descriptor: QueryParameterRule,
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
