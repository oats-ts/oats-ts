import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  PathArray,
  PathDeserializer,
  PathParameterDescriptor,
  PathParameters,
  PathObject,
  PathPrimitive,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  RawPath,
  ValueDescriptor,
  ParameterSegment,
  PathSchema,
} from './types'
import { isNil } from './utils'

export class DefaultPathDeserializer<T> extends BaseDeserializer implements PathDeserializer<T> {
  constructor(protected readonly parameters: PathParameters<T>) {
    super()
  }

  protected basePath(): string {
    return 'path'
  }

  public deserialize(input: string): Try<T> {
    return fluent(this.parseRawPath(input, this.basePath()))
      .flatMap((raw) => {
        const deserialized = Object.keys(this.parameters.descriptor).reduce(
          (acc: Record<string, Try<ParameterValue>>, key: string) => {
            const descriptor = this.parameters.descriptor[key as keyof T]
            acc[key] = this.parameter(descriptor, key, raw, this.append(this.basePath(), key))
            return acc
          },
          {},
        )
        return fromRecord(deserialized) as Try<T>
      })
      .toTry()
  }

  protected parameter(
    descriptor: PathParameterDescriptor,
    name: string,
    value: RawPath,
    path: string,
  ): Try<ParameterValue> {
    if (descriptor.type === 'schema') {
      return this.schema(descriptor, name, value, path)
    }
    switch (descriptor.style) {
      case 'simple': {
        switch (descriptor.type) {
          case 'primitive':
            return this.simplePrimitive(descriptor, name, value, path)
          case 'array':
            return this.simpleArray(descriptor, name, value, path)
          case 'object':
            return this.simpleObject(descriptor, name, value, path)
          default: {
            throw unexpectedType((descriptor as any).type)
          }
        }
      }
      case 'label': {
        switch (descriptor.type) {
          case 'primitive':
            return this.labelPrimitive(descriptor, name, value, path)
          case 'array':
            return this.labelArray(descriptor, name, value, path)
          case 'object':
            return this.labelObject(descriptor, name, value, path)
          default:
            throw unexpectedType((descriptor as any).type)
        }
      }
      case 'matrix': {
        switch (descriptor.type) {
          case 'primitive':
            return this.matrixPrimitive(descriptor, name, value, path)
          case 'array':
            return this.matrixArray(descriptor, name, value, path)
          case 'object':
            return this.matrixObject(descriptor, name, value, path)
          default:
            throw unexpectedType((descriptor as any).type)
        }
      }
      default:
        throw unexpectedStyle(descriptor.style, ['simple', 'label', 'matrix'])
    }
  }

  protected parseRawPath(pathValue: string, path: string): Try<RawPath> {
    const parameterNames = this.parameters.pathSegments
      .filter((segment): segment is ParameterSegment => segment.type === 'parameter')
      .map((segment) => segment.name)

    // Regex reset just in case before
    this.parameters.matcher.lastIndex = 0

    const values = this.parameters.matcher.exec(pathValue)
    if (isNil(values) || values.length !== parameterNames.length + 1) {
      return failure({
        message: `should have parameters ${parameterNames.map((p) => `"${p}"`).join(', ')}`,
        path,
        severity: 'error',
      })
    }

    const result: RawPath = {}

    for (let i = 0; i < parameterNames.length; i += 1) {
      const name = parameterNames[i]
      const value = values[i + 1]
      result[name] = value
    }
    // Regex reset after, as it can be stateful with the global flag
    this.parameters.matcher.lastIndex = 0
    return success(result)
  }

  protected simplePrimitive(descriptor: PathPrimitive, name: string, data: RawPath, path: string): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.values.deserialize(descriptor.value, this.decode(pathValue), path))
      .toTry()
  }

  protected simpleArray(descriptor: PathArray, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((value): Try<PrimitiveArray> => {
        const values = value.split(',').map((val) => this.decode(val))
        return this.stringValuesToArray(descriptor.items, values, path)
      })
      .toTry()
  }

  protected simpleObject(descriptor: PathObject, name: string, data: RawPath, path: string): Try<PrimitiveRecord> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((rawDataStr) =>
        descriptor.explode
          ? this.keyValueToRecord(',', '=', rawDataStr, path)
          : this.delimitedToRecord(',', rawDataStr, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(descriptor.properties, record as any, path))
      .toTry()
  }

  protected labelPrimitive(descriptor: PathPrimitive, name: string, data: RawPath, path: string): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawValue) => this.values.deserialize(descriptor.value, this.decode(rawValue), path))
      .toTry()
  }

  protected labelArray(descriptor: PathArray, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((value): Try<PrimitiveArray> => {
        const values = value.split(descriptor.explode ? '.' : ',').map((val) => this.decode(val))
        return this.stringValuesToArray(descriptor.items, values, path)
      })
      .toTry()
  }

  protected labelObject(descriptor: PathObject, name: string, data: RawPath, path: string): Try<PrimitiveRecord> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawDataStr) =>
        descriptor.explode
          ? this.keyValueToRecord('.', '=', rawDataStr, path)
          : this.delimitedToRecord(',', rawDataStr, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(descriptor.properties, record, path))
      .toTry()
  }

  protected matrixPrimitive(descriptor: PathPrimitive, name: string, data: RawPath, path: string): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, `;${this.encode(name)}=`))
      .flatMap((rawValue) => this.values.deserialize(descriptor.value, this.decode(rawValue), path))
      .toTry()
  }

  protected matrixArray(descriptor: PathArray, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return descriptor.explode
      ? this.matrixArrayExplode(descriptor.items, name, data, path)
      : this.matrixArrayNoExplode(descriptor.items, name, data, path)
  }

  protected matrixArrayExplode(
    descriptor: ValueDescriptor,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, ';'))
      .flatMap((rawString): Try<PrimitiveArray> => {
        const split = rawString.split(';').map((kvPair) => kvPair.split('=') as [string, string])
        const issues = split
          .map((parts, index): Issue | undefined => {
            const itemPath = this.append(path, index)
            if (parts.length !== 2) {
              return { message: `malformed value "${rawString}"`, path: itemPath, severity: 'error' }
            }
            if (parts[0] !== name) {
              return { message: `should be ${name}=${parts[1]}`, path: itemPath, severity: 'error' }
            }
          })
          .filter((issue): issue is Issue => !isNil(issue))
        if (issues.length !== 0) {
          return failure(...issues) as Try<PrimitiveArray>
        }
        const values = split.map(([_, value]) => this.decode(value))
        return this.stringValuesToArray(descriptor, values, path)
      })
      .toTry()
  }

  protected matrixArrayNoExplode(
    descriptor: ValueDescriptor,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, `;${this.encode(name)}=`))
      .flatMap((rawValue) => {
        const values = rawValue.split(',').map((val) => this.decode(val))
        return this.stringValuesToArray(descriptor, values, path)
      })
      .toTry()
  }

  protected matrixObject(descriptor: PathObject, name: string, data: RawPath, path: string): Try<PrimitiveRecord> {
    const prefix = descriptor.explode ? ';' : `;${this.encode(name)}=`
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, prefix))
      .flatMap((rawValue) =>
        descriptor.explode
          ? this.keyValueToRecord(';', '=', rawValue, path)
          : this.delimitedToRecord(',', rawValue, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(descriptor.properties, record, path))
      .toTry()
  }

  protected schema(descriptor: PathSchema, name: string, data: RawPath, path: string): Try<any> {
    return fluent(this.getPathValue(name, path, data))
      .map((value) => this.decode(value))
      .flatMap((value) => this.schemaDeserialize(descriptor, value, path))
      .flatMap((value) => this.validate(descriptor.schema, value))
  }

  protected getPathValue(name: string, path: string, raw: RawPath): Try<string> {
    const value = raw[name]
    if (isNil(value)) {
      return failure({
        message: `should not be ${value}`,
        path,
        severity: 'error',
      })
    }
    return success(value)
  }

  protected getPrefixedValue(path: string, value: string, prefix: string): Try<string> {
    if (value.indexOf(prefix) !== 0) {
      return failure({
        message: `should start with "${prefix}"`,
        path,
        severity: 'error',
      })
    }
    return success(value.slice(prefix.length))
  }

  protected delimitedToRecord(separator: string, value: string, path: string): Try<Record<string, string>> {
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
    keyValueSeparator: string,
    value: string,
    path: string,
  ): Try<Record<string, string>> {
    const kvPairStrs = value.split(separator)
    const record: Record<string, string> = {}
    const issues: Issue[] = []
    for (let i = 0; i < kvPairStrs.length; i += 1) {
      const kvPairStr = kvPairStrs[i]
      const pair = kvPairStr.split(keyValueSeparator)
      if (pair.length !== 2) {
        issues.push({
          message: `unexpected content "${value}"`,
          path,
          severity: 'error',
        })
      }
      const [rawKey, rawValue] = pair
      record[rawKey] = rawValue
    }
    return issues.length === 0 ? success(record) : failure(...issues)
  }
}
