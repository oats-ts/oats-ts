import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { failure, fluent, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { isNil } from './utils'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  RawPath,
  HeaderDeserializer,
  HeaderParameters,
  HeaderParameterDescriptor,
  HeaderPrimitive,
  HeaderArray,
  HeaderObject,
  ValueDescriptor,
} from './types'

export class DefaultHeaderDeserializer<T> extends BaseDeserializer implements HeaderDeserializer<T> {
  constructor(protected readonly parameters: HeaderParameters<T>) {
    super()
  }

  public deserialize(input: RawHttpHeaders): Try<T> {
    const deserialized = Object.keys(this.parameters.descriptor).reduce(
      (acc: Record<string, Try<ParameterValue>>, _key: string) => {
        const key = _key as string & keyof T
        const descriptor = this.parameters.descriptor[key]
        acc[key] = this.parameter(descriptor, key, input ?? {}, this.append(this.basePath(), key))
        return acc
      },
      {},
    )
    return fromRecord(deserialized) as Try<T>
  }

  protected basePath(): string {
    return 'headers'
  }

  protected parameter(
    descriptor: HeaderParameterDescriptor,
    name: string,
    value: RawPath,
    path: string,
  ): Try<ParameterValue> {
    const { style, type } = descriptor
    switch (style) {
      case 'simple': {
        switch (type) {
          case 'primitive':
            return this.simplePrimitive(descriptor, name, value, path)
          case 'array':
            return this.simpleArray(descriptor, name, value, path)
          case 'object':
            return this.simpleObject(descriptor, name, value, path)
          default: {
            throw unexpectedType(type)
          }
        }
      }
      default:
        throw unexpectedStyle(style, ['simple', 'label', 'matrix'])
    }
  }

  protected simplePrimitive(
    descriptor: HeaderPrimitive,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<Primitive> {
    return fluent(this.getHeaderValue(descriptor, name, path, data))
      .flatMap((value) =>
        isNil(value) ? success(undefined) : this.values.deserialize(descriptor.value, this.decode(value), path),
      )
      .toTry()
  }

  protected simpleArray(
    descriptor: HeaderArray,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getHeaderValue(descriptor, name, path, data))
      .flatMap((pathValue) => this.deserializeArray(descriptor.items, ',', pathValue, path))
      .toTry()
  }

  protected simpleObject(
    descriptor: HeaderObject,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<PrimitiveRecord> {
    return fluent(this.getHeaderValue(descriptor, name, path, data))
      .flatMap((rawDataStr: string): Try<Record<string, string> | undefined> => {
        if (isNil(rawDataStr)) {
          return success(undefined)
        }
        return descriptor.explode
          ? this.keyValueToRecord(',', '=', rawDataStr, path)
          : this.delimitedToRecord(',', rawDataStr, path)
      })
      .flatMap((record?: Record<string, string>): Try<PrimitiveRecord> => {
        if (isNil(record)) {
          return success(undefined)
        }
        return this.keyValuePairsToObject(descriptor.properties, record, path)
      })
      .toTry()
  }

  protected getHeaderValue(
    descriptor: HeaderParameterDescriptor,
    name: string,
    path: string,
    raw: RawHttpHeaders,
  ): Try<string> {
    const value = raw[name] ?? raw[name.toLowerCase()]
    if (isNil(value) && descriptor.required) {
      return failure({
        message: `should not be ${value}`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected delimitedToRecord(separator: string, value: string, path: string): Try<Record<string, string>> {
    if (value.length === 0) {
      return success({})
    }
    const parts = value.split(separator)
    const issues: Issue[] = []
    if (parts.length % 2 !== 0) {
      issues.push({
        message: `malformed parameter value "${value}"`,
        path,
        severity: 'error',
      })
    }
    const record: Record<string, string> = {}
    for (let i = 0; i < parts.length; i += 2) {
      const key = parts[i]
      const value = parts[i + 1]
      record[key] = value
    }
    return issues.length === 0 ? success(record) : failure(...issues)
  }

  protected keyValueToRecord(
    separator: string,
    kvSeparator: string,
    value: string,
    path: string,
  ): Try<Record<string, string>> {
    const kvPairStrs = value.split(separator)
    const record: Record<string, string> = {}
    const issues: Issue[] = []
    for (let i = 0; i < kvPairStrs.length; i += 1) {
      const kvPairStr = kvPairStrs[i]
      const pair = kvPairStr.split(kvSeparator)
      if (pair.length !== 2) {
        issues.push({
          message: `unexpected content "${kvPairStr}"`,
          path,
          severity: 'error',
        })
      }
      const [rawKey, rawValue] = pair
      record[rawKey] = rawValue
    }
    return issues.length === 0 ? success(record) : failure(...issues)
  }

  protected deserializeArray(
    descriptor: ValueDescriptor,
    separator: string,
    value: string,
    path: string,
  ): Try<PrimitiveArray> {
    if (isNil(value)) {
      return success(undefined)
    }
    if (value.length === 0) {
      return success([])
    }
    return fromArray(
      value
        .split(separator)
        .map((value, i) => this.values.deserialize(descriptor, this.decode(value), this.append(path, i))),
    )
  }
}
