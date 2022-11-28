import { failure, fluent, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  PathArray,
  PathDeserializer,
  PathDsl,
  PathDslRoot,
  PathObject,
  PathPrimitive,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  RawPath,
  ValueDsl,
  ParameterSegment,
} from './types'
import { isNil } from './utils'

export class DefaultPathDeserializer<T> extends BaseDeserializer implements PathDeserializer<T> {
  constructor(protected readonly dsl: PathDslRoot<T>) {
    super()
  }

  protected basePath(): string {
    return 'path'
  }

  public deserialize(input: string): Try<T> {
    return fluent(this.parseRawPath(input, this.basePath()))
      .flatMap((raw) => {
        const deserialized = Object.keys(this.dsl.schema).reduce(
          (acc: Record<string, Try<ParameterValue>>, key: string) => {
            const paramDsl = this.dsl.schema[key as keyof T]
            acc[key] = this.parameter(paramDsl, key, raw, this.append(this.basePath(), key))
            return acc
          },
          {},
        )
        return fromRecord(deserialized) as Try<T>
      })
      .toTry()
  }

  protected parameter(dsl: PathDsl, name: string, value: RawPath, path: string): Try<ParameterValue> {
    const { style, type } = dsl
    switch (style) {
      case 'simple': {
        switch (type) {
          case 'primitive':
            return this.simplePrimitive(dsl, name, value, path)
          case 'array':
            return this.simpleArray(dsl, name, value, path)
          case 'object':
            return this.simpleObject(dsl, name, value, path)
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'label': {
        switch (type) {
          case 'primitive':
            return this.labelPrimitive(dsl, name, value, path)
          case 'array':
            return this.labelArray(dsl, name, value, path)
          case 'object':
            return this.labelObject(dsl, name, value, path)
          default:
            throw unexpectedType(type)
        }
      }
      case 'matrix': {
        switch (dsl.type) {
          case 'primitive':
            return this.matrixPrimitive(dsl, name, value, path)
          case 'array':
            return this.matrixArray(dsl, name, value, path)
          case 'object':
            return this.matrixObject(dsl, name, value, path)
          default:
            throw unexpectedType(type)
        }
      }
      default:
        throw unexpectedStyle(style, ['simple', 'label', 'matrix'])
    }
  }

  protected parseRawPath(pathValue: string, path: string): Try<RawPath> {
    const parameterNames = this.dsl.pathSegments
      .filter((segment): segment is ParameterSegment => segment.type === 'parameter')
      .map((segment) => segment.name)

    // Regex reset just in case before
    this.dsl.matcher.lastIndex = 0

    const values = this.dsl.matcher.exec(pathValue)
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
    this.dsl.matcher.lastIndex = 0
    return success(result)
  }

  protected simplePrimitive(dsl: PathPrimitive, name: string, data: RawPath, path: string): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.values.deserialize(dsl.value, this.decode(pathValue), path))
      .toTry()
  }

  protected simpleArray(dsl: PathArray, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.deserializeArray(dsl.items, ',', pathValue, name, path))
      .toTry()
  }

  protected simpleObject(dsl: PathObject, name: string, data: RawPath, path: string): Try<PrimitiveRecord> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((rawDataStr) =>
        dsl.explode ? this.keyValueToRecord(',', '=', rawDataStr, path) : this.delimitedToRecord(',', rawDataStr, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(dsl.properties, record as any, path))
      .toTry()
  }

  protected labelPrimitive(dsl: PathPrimitive, name: string, data: RawPath, path: string): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawValue) => this.values.deserialize(dsl.value, this.decode(rawValue), path))
      .toTry()
  }

  protected labelArray(dsl: PathArray, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((value) => this.deserializeArray(dsl.items, dsl.explode ? '.' : ',', value, name, path))
      .toTry()
  }

  protected labelObject(dsl: PathObject, name: string, data: RawPath, path: string): Try<PrimitiveRecord> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawDataStr) =>
        dsl.explode ? this.keyValueToRecord('.', '=', rawDataStr, path) : this.delimitedToRecord(',', rawDataStr, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(dsl.properties, record, path))
      .toTry()
  }

  protected matrixPrimitive(dsl: PathPrimitive, name: string, data: RawPath, path: string): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, `;${this.encode(name)}=`))
      .flatMap((rawValue) => this.values.deserialize(dsl.value, this.decode(rawValue), path))
      .toTry()
  }

  protected matrixArray(dsl: PathArray, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return dsl.explode
      ? this.matrixArrayExplode(dsl.items, name, data, path)
      : this.matrixArrayNoExplode(dsl.items, name, data, path)
  }

  protected matrixArrayExplode(dsl: ValueDsl, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, ';'))
      .flatMap((rawString) => {
        const parsed = rawString.split(';').map((kvPair, index) => {
          const parts = kvPair.split('=')
          const itemPath = this.append(path, index)
          if (parts.length !== 2) {
            return failure({
              message: `malformed parameter value "${rawString}"`,
              path: itemPath,
              severity: 'error',
            })
          }
          const [key, value] = parts.map((part) => this.decode(part))
          if (key !== name) {
            return failure({
              message: `malformed parameter value "${rawString}"`,
              path: itemPath,
              severity: 'error',
            })
          }
          return this.values.deserialize(dsl, value, itemPath)
        })
        return fromArray(parsed)
      })
      .toTry()
  }

  protected matrixArrayNoExplode(dsl: ValueDsl, name: string, data: RawPath, path: string): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, `;${this.encode(name)}=`))
      .flatMap((rawValue) => {
        const tryValues = rawValue
          .split(',')
          .map((value, index) => this.values.deserialize(dsl, this.decode(value), this.append(path, index)))
        return fromArray(tryValues)
      })
      .toTry()
  }

  protected matrixObject(dsl: PathObject, name: string, data: RawPath, path: string): Try<PrimitiveRecord> {
    const prefix = dsl.explode ? ';' : `;${this.encode(name)}=`
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, prefix))
      .flatMap((rawValue) =>
        dsl.explode ? this.keyValueToRecord(';', '=', rawValue, path) : this.delimitedToRecord(',', rawValue, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(dsl.properties, record, path))
      .toTry()
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

  protected deserializeArray(
    dsl: ValueDsl,
    separator: string,
    value: string,
    name: string,
    path: string,
  ): Try<Primitive[] | undefined> {
    return isNil(value)
      ? success(undefined)
      : fromArray(
          value
            .split(separator)
            .map((value, i) => this.values.deserialize(dsl, this.decode(value), this.append(path, i))),
        )
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
