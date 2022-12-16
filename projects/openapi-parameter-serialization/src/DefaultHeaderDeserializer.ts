import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { failure, fluent, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { isNil } from './utils'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, PrimitiveArray, PrimitiveRecord, RawPath, HeaderDeserializer } from './types'
import {
  ArrayParameterRule,
  HeaderDescriptorRule,
  HeaderParameterRule,
  MimeTypeParameterRule,
  ObjectParameterRule,
  PrimitiveParameterRule,
  ValueParameterRule,
} from '@oats-ts/rules'

export class DefaultHeaderDeserializer<T> extends BaseDeserializer implements HeaderDeserializer<T> {
  constructor(protected readonly parameters: HeaderDescriptorRule<T>) {
    super()
  }

  public deserialize(input: RawHttpHeaders): Try<T> {
    const deserialized = Object.keys(this.parameters.parameters).reduce(
      (acc: Record<string, Try<ParameterValue>>, _key: string) => {
        const key = _key as string & keyof T
        const rule = this.parameters.parameters[key]
        acc[key] = this.parameter(rule, key, input ?? {}, this.append(this.basePath(), key))
        return acc
      },
      {},
    )
    return fluent(fromRecord(deserialized) as Try<T>)
      .flatMap((value) => this.validate<T>(this.parameters.schema, value, this.basePath()))
      .toTry()
  }

  protected basePath(): string {
    return 'headers'
  }

  protected parameter(rule: HeaderParameterRule, name: string, value: RawPath, path: string): Try<ParameterValue> {
    if (rule.structure.type === 'mime-type') {
      return this.schema(rule as HeaderParameterRule<MimeTypeParameterRule>, name, value, path)
    }
    switch (rule.style) {
      case 'simple': {
        switch (rule.structure.type) {
          case 'primitive':
            return this.simplePrimitive(rule as HeaderParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.simpleArray(rule as HeaderParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.simpleObject(rule as HeaderParameterRule<ObjectParameterRule>, name, value, path)
          default: {
            throw unexpectedType((rule as HeaderParameterRule).structure.type)
          }
        }
      }
      default:
        throw unexpectedStyle(rule.style, ['simple', 'label', 'matrix'])
    }
  }

  protected simplePrimitive(
    rule: HeaderParameterRule<PrimitiveParameterRule>,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<Primitive> {
    return fluent(this.getHeaderValue(rule, name, path, data))
      .flatMap((value) =>
        isNil(value) ? success(undefined) : this.values.deserialize(rule.structure.value, this.decode(value), path),
      )
      .toTry()
  }

  protected simpleArray(
    rule: HeaderParameterRule<ArrayParameterRule>,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<PrimitiveArray> {
    return fluent(this.getHeaderValue(rule, name, path, data))
      .flatMap((pathValue) => this.deserializeArray(rule.structure.items, ',', pathValue, path))
      .toTry()
  }

  protected simpleObject(
    rule: HeaderParameterRule<ObjectParameterRule>,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<PrimitiveRecord> {
    return fluent(this.getHeaderValue(rule, name, path, data))
      .flatMap((rawDataStr: string): Try<Record<string, string> | undefined> => {
        if (isNil(rawDataStr)) {
          return success(undefined)
        }
        return rule.explode
          ? this.keyValueToRecord(',', '=', rawDataStr, path)
          : this.delimitedToRecord(',', rawDataStr, path)
      })
      .flatMap((record?: Record<string, string>): Try<PrimitiveRecord> => {
        if (isNil(record)) {
          return success(undefined)
        }
        return this.keyValuePairsToObject(rule.structure.properties, record, path)
      })
      .toTry()
  }

  protected schema(
    rule: HeaderParameterRule<MimeTypeParameterRule>,
    name: string,
    data: RawHttpHeaders,
    path: string,
  ): Try<any> {
    return fluent(this.getHeaderValue(rule, name, path, data))
      .map((value) => (isNil(value) ? value : this.decode(value)))
      .flatMap((value) => this.schemaDeserialize(rule.structure, value, path))
  }

  protected getHeaderValue(rule: HeaderParameterRule, name: string, path: string, raw: RawHttpHeaders): Try<string> {
    const value = raw[name] ?? raw[name.toLowerCase()]
    if (isNil(value) && rule.required) {
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
    rule: ValueParameterRule,
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
      value.split(separator).map((value, i) => this.values.deserialize(rule, this.decode(value), this.append(path, i))),
    )
  }
}
