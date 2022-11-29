import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  PathArray,
  PathParameterDescriptor,
  PathParameters,
  PathObject,
  PathPrimitive,
  PathSerializer,
  Primitive,
  PrimitiveRecord,
} from './types'
import { entries, isNil } from './utils'

export class DefaultPathSerializer<T> extends BaseSerializer implements PathSerializer<T> {
  constructor(protected readonly parameters: PathParameters<T>) {
    super()
  }

  protected basePath(): string {
    return 'path'
  }

  public serialize(input: T): Try<string> {
    const serializedParts = fromRecord(
      Object.keys(this.parameters.descriptor).reduce((parts: Record<string, Try<string>>, name: string) => {
        const key = name as keyof T & string
        const descriptor: PathParameterDescriptor = this.parameters.descriptor[key]
        const value: any = input?.[key]
        const path = this.append(this.basePath(), key)
        parts[name] = this.parameter(descriptor, key, value, path)
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

  protected parameter(descriptor: PathParameterDescriptor, name: string, value: any, path: string): Try<string> {
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
      case 'label': {
        switch (type) {
          case 'primitive':
            return this.labelPrimitive(descriptor, name, value, path)
          case 'array':
            return this.labelArray(descriptor, name, value, path)
          case 'object':
            return this.labelObject(descriptor, name, value, path)
          default:
            throw unexpectedType(type)
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
            throw unexpectedType(type)
        }
      }
      default:
        throw unexpectedStyle(style, ['simple', 'label', 'matrix'])
    }
  }

  protected simplePrimitive(descriptor: PathPrimitive, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => this.encode(value?.toString()))
      .toTry()
  }

  protected simpleArray(descriptor: PathArray, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathArray(path, value ?? []))
      .map((value) => this.joinArrayItems('', ',', value))
      .toTry()
  }

  protected simpleObject(descriptor: PathObject, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) => this.joinKeyValuePairs('', descriptor.explode ? '=' : ',', ',', entries(value!)))
      .toTry()
  }

  protected labelPrimitive(descriptor: PathPrimitive, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => `.${this.encode(value?.toString())}`)
      .toTry()
  }

  protected labelArray(descriptor: PathArray, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((pathValue) => this.validatePathArray(path, pathValue!))
      .map((value): string => this.joinArrayItems('.', descriptor.explode ? '.' : ',', value!))
      .toTry()
  }

  protected labelObject(descriptor: PathObject, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) => {
        const kvSeparator = descriptor.explode ? '=' : ','
        const separator = descriptor.explode ? '.' : ','
        return this.joinKeyValuePairs('.', kvSeparator, separator, entries(value!))
      })
      .toTry()
  }

  protected matrixPrimitive(descriptor: PathPrimitive, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => {
        const nameStr = this.encode(name)
        const valueStr = this.encode(value?.toString())
        return `;${nameStr}=${valueStr}`
      })
      .toTry()
  }

  protected matrixArray(descriptor: PathArray, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathArray(path, value!))
      .map((value) => {
        if (!descriptor.explode) {
          return this.joinArrayItems(`;${this.encode(name)}=`, ',', value!)
        }
        const kvPairs = value!.map((v): [string, Primitive] => [name, v])
        return this.joinKeyValuePairs(';', '=', ';', kvPairs)
      })
      .toTry()
  }

  protected matrixObject(descriptor: PathObject, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) =>
        this.joinKeyValuePairs(
          descriptor.explode ? ';' : `;${this.encode(name)}=`,
          descriptor.explode ? '=' : ',',
          descriptor.explode ? ';' : ',',
          entries(value!),
        ),
      )
      .toTry()
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
