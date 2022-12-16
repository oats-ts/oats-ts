import {
  ArrayParameterRule,
  MimeTypeParameterRule,
  ObjectParameterRule,
  ParameterSegment,
  PathDescriptorRule,
  PathParameterRule,
  PrimitiveParameterRule,
} from '@oats-ts/rules'
import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, PathDeserializer, Primitive, PrimitiveArray, PrimitiveRecord, RawPath } from './types'
import { isNil } from './utils'

export class DefaultPathDeserializer<T> extends BaseDeserializer implements PathDeserializer<T> {
  constructor(protected readonly parameters: PathDescriptorRule<T>) {
    super()
  }

  protected basePath(): string {
    return 'path'
  }

  public deserialize(input: string): Try<T> {
    return fluent(this.parseRawPath(input, this.basePath()))
      .flatMap((raw) => {
        const deserialized = Object.keys(this.parameters.parameters).reduce(
          (acc: Record<string, Try<ParameterValue>>, key: string) => {
            const rule = this.parameters.parameters[key as keyof T]
            acc[key] = this.parameter(rule, key, raw, this.append(this.basePath(), key))
            return acc
          },
          {},
        )
        return fromRecord(deserialized) as Try<T>
      })
      .flatMap((value) => this.validate<T>(this.parameters.schema, value, this.basePath()))
      .toTry()
  }

  protected parameter(rule: PathParameterRule, name: string, value: RawPath, path: string): Try<ParameterValue> {
    if (rule.structure.type === 'mime-type') {
      return this.schema(rule as PathParameterRule<MimeTypeParameterRule>, name, value, path)
    }
    switch (rule.style) {
      case 'simple': {
        switch (rule.structure.type) {
          case 'primitive':
            return this.simplePrimitive(rule as PathParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.simpleArray(rule as PathParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.simpleObject(rule as PathParameterRule<ObjectParameterRule>, name, value, path)
          default: {
            throw unexpectedType((rule.structure as PathParameterRule).structure.type)
          }
        }
      }
      case 'label': {
        switch (rule.structure.type) {
          case 'primitive':
            return this.labelPrimitive(rule as PathParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.labelArray(rule as PathParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.labelObject(rule as PathParameterRule<ObjectParameterRule>, name, value, path)
          default:
            throw unexpectedType((rule as PathParameterRule).structure.type)
        }
      }
      case 'matrix': {
        switch (rule.structure.type) {
          case 'primitive':
            return this.matrixPrimitive(rule as PathParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.matrixArray(rule as PathParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.matrixObject(rule as PathParameterRule<ObjectParameterRule>, name, value, path)
          default:
            throw unexpectedType((rule as PathParameterRule).structure.type)
        }
      }
      default:
        throw unexpectedStyle(rule.style, ['simple', 'label', 'matrix'])
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

  protected simplePrimitive(
    rule: PathParameterRule<PrimitiveParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.values.deserialize(rule.structure.value, this.decode(pathValue), path))
      .toTry()
  }

  protected simpleArray(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((value): Try<PrimitiveArray> => {
        const values = value.split(',').map((val) => this.decode(val))
        return this.stringValuesToArray(rule.structure.items, values, path)
      })
      .toTry()
  }

  protected simpleObject(
    rule: PathParameterRule<ObjectParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveRecord> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((rawDataStr) =>
        rule.explode
          ? this.keyValueToRecord(',', '=', rawDataStr, path)
          : this.delimitedToRecord(',', rawDataStr, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(rule.structure.properties, record as any, path))
      .toTry()
  }

  protected labelPrimitive(
    rule: PathParameterRule<PrimitiveParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawValue) => this.values.deserialize(rule.structure.value, this.decode(rawValue), path))
      .toTry()
  }

  protected labelArray(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((value): Try<PrimitiveArray> => {
        const values = value.split(rule.explode ? '.' : ',').map((val) => this.decode(val))
        return this.stringValuesToArray(rule.structure.items, values, path)
      })
      .toTry()
  }

  protected labelObject(
    rule: PathParameterRule<ObjectParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveRecord> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, '.'))
      .flatMap((rawDataStr) =>
        rule.explode
          ? this.keyValueToRecord('.', '=', rawDataStr, path)
          : this.delimitedToRecord(',', rawDataStr, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(rule.structure.properties, record, path))
      .toTry()
  }

  protected matrixPrimitive(
    rule: PathParameterRule<PrimitiveParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<Primitive> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, `;${this.encode(name)}=`))
      .flatMap((rawValue) => this.values.deserialize(rule.structure.value, this.decode(rawValue), path))
      .toTry()
  }

  protected matrixArray(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveArray> {
    return rule.explode
      ? this.matrixArrayExplode(rule, name, data, path)
      : this.matrixArrayNoExplode(rule, name, data, path)
  }

  protected matrixArrayExplode(
    rule: PathParameterRule<ArrayParameterRule>,
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
        return this.stringValuesToArray(rule.structure.items, values, path)
      })
      .toTry()
  }

  protected matrixArrayNoExplode(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, `;${this.encode(name)}=`))
      .flatMap((rawValue) => {
        const values = rawValue.split(',').map((val) => this.decode(val))
        return this.stringValuesToArray(rule.structure.items, values, path)
      })
      .toTry()
  }

  protected matrixObject(
    rule: PathParameterRule<ObjectParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<PrimitiveRecord> {
    const prefix = rule.explode ? ';' : `;${this.encode(name)}=`
    return fluent(this.getPathValue(name, path, data))
      .flatMap((pathValue) => this.getPrefixedValue(path, pathValue, prefix))
      .flatMap((rawValue) =>
        rule.explode ? this.keyValueToRecord(';', '=', rawValue, path) : this.delimitedToRecord(',', rawValue, path),
      )
      .flatMap((record) => this.keyValuePairsToObject(rule.structure.properties, record, path))
      .toTry()
  }

  protected schema(
    rule: PathParameterRule<MimeTypeParameterRule>,
    name: string,
    data: RawPath,
    path: string,
  ): Try<any> {
    return fluent(this.getPathValue(name, path, data))
      .map((value) => this.decode(value))
      .flatMap((value) => this.schemaDeserialize(rule.structure, value, path))
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
