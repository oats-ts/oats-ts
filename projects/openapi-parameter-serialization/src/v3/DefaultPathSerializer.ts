import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { Base } from './Base'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  PathArray,
  PathDsl,
  PathDslRoot,
  PathObject,
  PathPrimitive,
  PathSerializer,
  Primitive,
  PrimitiveRecord,
} from './types'
import { entries, isNil } from './utils'

export class DefaultPathSerializer<T> extends Base implements PathSerializer<T> {
  constructor(protected readonly dsl: PathDslRoot<T>) {
    super()
  }

  protected basePath(): string {
    return 'path'
  }

  public serialize(input: T): Try<string> {
    const serializedParts = fromRecord(
      Object.keys(this.dsl.schema).reduce((parts: Record<string, Try<string>>, name: string) => {
        const key = name as keyof T & string
        const dsl: PathDsl = this.dsl.schema[key]
        const value: any = input[key]
        const path = this.append(this.basePath(), key)
        parts[name] = this.parameter(dsl, key, value, path)
        return parts
      }, {}),
    )

    return fluent(serializedParts)
      .map((serialized) => {
        return this.dsl.pathSegments
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

  protected parameter(dsl: PathDsl, name: string, value: any, path: string): Try<string> {
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

  protected simplePrimitive(dsl: PathPrimitive, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => this.encode(value?.toString()))
      .toTry()
  }

  protected simpleArray(dsl: PathArray, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathArray(path, value ?? []))
      .map((value) => this.joinArrayItems('', ',', value))
      .toTry()
  }

  protected simpleObject(dsl: PathObject, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) => this.joinKeyValuePairs('', dsl.explode ? '=' : ',', ',', entries(value!)))
      .toTry()
  }

  protected labelPrimitive(dsl: PathPrimitive, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => `.${this.encode(value?.toString())}`)
      .toTry()
  }

  protected labelArray(dsl: PathArray, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((pathValue) => this.validatePathArray(path, pathValue!))
      .map((value): string => this.joinArrayItems('.', dsl.explode ? '.' : ',', value!))
      .toTry()
  }

  protected labelObject(dsl: PathObject, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) => {
        const kvSeparator = dsl.explode ? '=' : ','
        const separator = dsl.explode ? '.' : ','
        return this.joinKeyValuePairs('.', kvSeparator, separator, entries(value!))
      })
      .toTry()
  }

  protected matrixPrimitive(dsl: PathPrimitive, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathPrimitive(path, value))
      .map((value) => {
        const nameStr = this.encode(name)
        const valueStr = this.encode(value?.toString())
        return `;${nameStr}=${valueStr}`
      })
      .toTry()
  }

  protected matrixArray(dsl: PathArray, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathArray(path, value!))
      .map((value) => {
        if (!dsl.explode) {
          return this.joinArrayItems(`;${this.encode(name)}=`, ',', value!)
        }
        const kvPairs = value!.map((v): [string, Primitive] => [name, v])
        return this.joinKeyValuePairs(';', '=', ';', kvPairs)
      })
      .toTry()
  }

  protected matrixObject(dsl: PathObject, name: string, data: any, path: string): Try<string> {
    return fluent(this.getPathValue(path, data))
      .flatMap((value) => this.validatePathObject(path, value))
      .map((value) =>
        this.joinKeyValuePairs(
          dsl.explode ? ';' : `;${this.encode(name)}=`,
          dsl.explode ? '=' : ',',
          dsl.explode ? ';' : ',',
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
