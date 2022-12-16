import {
  ArrayParameterRule,
  MimeTypeParameterRule,
  ObjectParameterRule,
  PathDescriptorRule,
  PathParameterRule,
  PrimitiveParameterRule,
} from '@oats-ts/rules'
import { failure, fluent, fromRecord, isFailure, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { PathSerializer, Primitive, PrimitiveRecord } from './types'
import { entries, isNil } from './utils'

export class DefaultPathSerializer<T> extends BaseSerializer implements PathSerializer<T> {
  constructor(protected readonly parameters: PathDescriptorRule<T>) {
    super()
  }

  protected basePath(): string {
    return 'path'
  }

  public serialize(input: T): Try<string> {
    const validationResult = this.validate(this.parameters.schema, input, this.basePath())
    if (isFailure(validationResult)) {
      return validationResult
    }
    const serializedParts = fromRecord(
      Object.keys(this.parameters.parameters).reduce((parts: Record<string, Try<string>>, name: string) => {
        const key = name as keyof T & string
        const rule: PathParameterRule = this.parameters.parameters[key]
        const value: any = input?.[key]
        const path = this.append(this.basePath(), key)
        parts[name] = this.parameter(rule, key, value, path)
        return parts
      }, {}),
    )

    return fluent(serializedParts)
      .map((serialized) => {
        return this.parameters.pathSegments
          .map((segment) => {
            switch (segment.type) {
              case 'parameter':
                return serialized[segment.name]
              case 'text':
                return segment.value
            }
          })
          .join('')
      })
      .toTry()
  }

  protected parameter(rule: PathParameterRule, name: string, value: any, path: string): Try<string> {
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
            throw unexpectedType((rule as PathParameterRule).structure.type)
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

  protected simplePrimitive(
    rule: PathParameterRule<PrimitiveParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => this.encode(value?.toString()))
      .toTry()
  }

  protected simpleArray(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathArray(path, value ?? []))
      .map((value) => this.joinArrayItems('', ',', value))
      .toTry()
  }

  protected simpleObject(
    rule: PathParameterRule<ObjectParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) => this.joinKeyValuePairs('', rule.explode ? '=' : ',', ',', entries(value!)))
      .toTry()
  }

  protected labelPrimitive(
    rule: PathParameterRule<PrimitiveParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => `.${this.encode(value?.toString())}`)
      .toTry()
  }

  protected labelArray(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((pathValue) => this.validatePathArray(path, pathValue!))
      .map((value): string => this.joinArrayItems('.', rule.explode ? '.' : ',', value!))
      .toTry()
  }

  protected labelObject(
    rule: PathParameterRule<ObjectParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) => {
        const kvSeparator = rule.explode ? '=' : ','
        const separator = rule.explode ? '.' : ','
        return this.joinKeyValuePairs('.', kvSeparator, separator, entries(value!))
      })
      .toTry()
  }

  protected matrixPrimitive(
    rule: PathParameterRule<PrimitiveParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => {
        const nameStr = this.encode(name)
        const valueStr = this.encode(value?.toString())
        return `;${nameStr}=${valueStr}`
      })
      .toTry()
  }

  protected matrixArray(
    rule: PathParameterRule<ArrayParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathArray(path, value!))
      .map((value) => {
        if (!rule.explode) {
          return this.joinArrayItems(`;${this.encode(name)}=`, ',', value!)
        }
        const kvPairs = value!.map((v): [string, Primitive] => [name, v])
        return this.joinKeyValuePairs(';', '=', ';', kvPairs)
      })
      .toTry()
  }

  protected matrixObject(
    rule: PathParameterRule<ObjectParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) =>
        this.joinKeyValuePairs(
          rule.explode ? ';' : `;${this.encode(name)}=`,
          rule.explode ? '=' : ',',
          rule.explode ? ';' : ',',
          entries(value!),
        ),
      )
      .toTry()
  }

  protected schema(rule: PathParameterRule<MimeTypeParameterRule>, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.schemaSerialize(rule.structure, value, path))
      .map((value) => this.encode(value))
  }

  protected joinArrayItems(prefix: string, separator: string, items: ReadonlyArray<Primitive>): string {
    const itemsStr = items.map((item) => this.encode(item?.toString())).join(separator)
    return `${prefix}${itemsStr}`
  }

  protected joinKeyValuePairs(
    prefix: string,
    kvSeparator: string,
    separator: string,
    items: [string, Primitive][],
  ): string {
    const itemsStr = items
      .filter(([, value]) => !isNil(value))
      .map(([key, value]) => {
        const keyStr = this.encode(key)
        const valStr = this.encode(value?.toString())
        return `${keyStr}${kvSeparator}${valStr}`
      })
      .join(separator)
    return `${prefix}${itemsStr}`
  }

  protected validatePathArray<T extends Primitive>(path: string, input: ReadonlyArray<T>): Try<ReadonlyArray<T>> {
    switch (input.length) {
      case 0: {
        return failure({
          message: `should not be empty`,
          path,
          severity: 'error',
        })
      }
      case 1: {
        const [head] = input
        if (`${head}`.length === 0) {
          return failure({
            message: `should not have a single 0 length item`,
            path,
            severity: 'error',
          })
        }
        return success(input)
      }
      default:
        return success(input)
    }
  }

  protected validatePathObject<T extends PrimitiveRecord>(path: string, input: T): Try<T> {
    const keys = Object.keys(input || {})
    switch (keys.length) {
      case 0: {
        return failure({
          message: `should not be empty`,
          path,
          severity: 'error',
        })
      }
      default:
        return success(input)
    }
  }

  protected validatePathPrimitive<T extends Primitive>(path: string, input: T): Try<T> {
    switch (`${input}`.length) {
      case 0: {
        return failure({
          message: 'should not be empty (attempting to serialize to 0 length string)',
          path,
          severity: 'error',
        })
      }
      default:
        return success(input)
    }
  }

  protected getPathValue<T>(path: string, value: T): Try<T> {
    if (!isNil(value)) {
      return success(value)
    }
    return failure({
      message: `should not be ${value}`,
      path,
      severity: 'error',
    })
  }
}
