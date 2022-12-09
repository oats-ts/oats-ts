import { failure, fluent, fromArray, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  QueryArray,
  QueryParameterDescriptor,
  QueryParameters,
  QueryObject,
  QueryPrimitive,
  QuerySerializer,
  QuerySchema,
} from './types'
import { entries, isNil } from './utils'

export class DefaultQuerySerializer<T> extends BaseSerializer implements QuerySerializer<T> {
  constructor(protected readonly parameters: QueryParameters<T>) {
    super()
  }

  protected basePath(): string {
    return 'query'
  }

  public serialize(input: T): Try<string | undefined> {
    const serializedParts = fromArray(
      Object.keys(this.parameters.descriptor).map((name: string) => {
        const key = name as keyof T & string
        const descriptor: QueryParameterDescriptor = this.parameters.descriptor[key]
        const value = input?.[key] as unknown as ParameterValue
        const path = this.append(this.basePath(), key)
        return this.parameter(descriptor, key, value, path)
      }, {}),
    )

    return fluent(serializedParts)
      .map((parts: string[][]): string[] => parts.reduce((flat, arr) => [...flat, ...arr], []))
      .map((parts) => (parts.length === 0 ? undefined : `?${parts.join('&')}`))
      .toTry()
  }

  protected parameter(descriptor: QueryParameterDescriptor, name: string, value: any, path: string): Try<string[]> {
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

  protected formPrimitive(descriptor: QueryPrimitive, name: string, data: Primitive, path: string): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .map((value) => {
        if (isNil(value)) {
          return []
        }
        const keyStr = this.encode(name)
        const valStr = this.encode(value?.toString())
        return [`${keyStr}=${valStr}`]
      })
      .toTry()
  }

  protected formArray(descriptor: QueryArray, name: string, data: PrimitiveArray, path: string): Try<string[]> {
    return this.delimitedArray(descriptor, ',', path, data, name)
  }

  protected formObject(descriptor: QueryObject, name: string, data: PrimitiveRecord, path: string): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .flatMap((value): Try<string[]> => {
        if (isNil(value)) {
          return success([])
        }
        return this.objectToKeyValuePairs(descriptor.properties, value, path).map((kvPairs): string[] => {
          if (kvPairs.length === 0) {
            return []
          }
          if (descriptor.explode) {
            return kvPairs.map(([key, value]) => `${this.encode(key)}=${this.encode(value)}`)
          }
          const valStr = kvPairs.map(([key, value]) => [this.encode(key), this.encode(value)].join(',')).join(',')
          return [`${this.encode(name)}=${valStr}`]
        })
      })
      .toTry()
  }

  protected pipeDelimitedArray(
    descriptor: QueryArray,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string[]> {
    return this.delimitedArray(descriptor, '|', path, data, name)
  }

  protected spaceDelimitedArray(
    descriptor: QueryArray,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string[]> {
    return this.delimitedArray(descriptor, this.encode(' '), path, data, name)
  }

  protected deepObjectObject(
    descriptor: QueryObject,
    name: string,
    data: PrimitiveRecord,
    path: string,
  ): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .flatMap((value) => {
        if (isNil(value)) {
          return success([])
        }
        const nameStr = this.encode(name)
        const kvPairs = entries(value)

        const output = kvPairs
          .filter(([, value]) => !isNil(value))
          .map(([key, value]) => {
            const keyStr = this.encode(key)
            const valueStr = this.encode(value?.toString())
            return `${nameStr}[${keyStr}]=${valueStr}`
          })

        return success(output)
      })
      .toTry()
  }

  protected schema(descriptor: QuerySchema, name: string, data: any, path: string): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .flatMap((value) => this.validate(descriptor, value, path))
      .flatMap((value) => this.schemaSerialize(descriptor, value, path))
      .map((value) => (isNil(value) ? [] : [`${this.encode(name)}=${this.encode(value)}`]))
  }

  protected delimitedArray(
    descriptor: QueryArray,
    delimiter: string,
    path: string,
    data: PrimitiveArray,
    name: string,
  ): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .flatMap((value): Try<string[]> => {
        if (isNil(value)) {
          return success([])
        }
        const keyStr = this.encode(name)
        return this.arrayToValues(descriptor.items, value, path).map((values) => {
          if (descriptor.explode) {
            return values.length === 0 ? [] : values.map((item) => `${keyStr}=${this.encode(item?.toString())}`)
          }
          return [`${keyStr}=${values.map((item) => this.encode(item?.toString())).join(delimiter)}`]
        })
      })
      .toTry()
  }

  protected getQueryValue<T extends ParameterValue>(
    descriptor: QueryParameterDescriptor,
    path: string,
    value: T | undefined,
  ): Try<T | undefined> {
    if (!isNil(value)) {
      return success(value)
    }
    if (!descriptor.required) {
      return success(undefined)
    }
    return failure({
      message: `should not be ${value}`,
      path,
      severity: 'error',
    })
  }
}
