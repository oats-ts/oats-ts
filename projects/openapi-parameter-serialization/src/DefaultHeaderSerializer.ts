import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { failure, fluent, fromRecord, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  HeaderParameters,
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  HeadersSerializer,
  HeaderParameterDescriptor,
  HeaderPrimitive,
  HeaderArray,
  HeaderObject,
  HeaderSchema,
} from './types'
import { isNil } from './utils'

export class DefaultHeaderSerializer<T> extends BaseSerializer implements HeadersSerializer<T> {
  constructor(protected readonly parameters: HeaderParameters<T>) {
    super()
  }

  protected basePath(): string {
    return 'headers'
  }

  public serialize(input: T): Try<RawHttpHeaders> {
    const validationResult = this.validate(this.parameters.schema, input, this.basePath())
    if (isFailure(validationResult)) {
      return validationResult
    }
    const serializedParts = Object.keys(this.parameters.descriptor).reduce(
      (parts: Record<string, Try<string>>, _key: string) => {
        const key = _key as keyof T & string
        const descriptor = this.parameters.descriptor[key as keyof T]
        const inputValue = input?.[key as keyof T]
        const value = this.parameter(descriptor, key, inputValue, this.append(this.basePath(), key))
        // Only add the stuff that failed or succeeded but is not undefined
        if ((isSuccess(value) && !isNil(value.data)) || isFailure(value)) {
          parts[key.toString().toLowerCase()] = value as Try<string>
        }
        return parts
      },
      {},
    )
    return fromRecord(serializedParts)
  }

  protected parameter(
    descriptor: HeaderParameterDescriptor,
    name: string,
    value: any,
    path: string,
  ): Try<string | undefined> {
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
      default:
        throw unexpectedStyle(descriptor.style, ['simple'])
    }
  }

  protected simplePrimitive(
    descriptor: HeaderPrimitive,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value): Try<string | undefined> => {
        return isNil(value)
          ? success(undefined)
          : fluent(this.values.serialize(descriptor.value, value, path)).map((value) => this.encode(value))
      })
      .toTry()
  }

  protected simpleArray(
    descriptor: HeaderArray,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value): Try<string | undefined> => {
        if (isNil(value)) {
          return success(undefined)
        }
        return this.arrayToValues(descriptor.items, value, path).map((items) =>
          items.map((item) => this.encode(item)).join(','),
        )
      })
      .toTry()
  }

  protected simpleObject(
    descriptor: HeaderObject,
    name: string,
    data: PrimitiveRecord,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value): Try<string | undefined> => {
        if (isNil(value)) {
          return success(undefined)
        }
        return this.objectToKeyValuePairs(descriptor.properties, value, path).map((pairs): string | undefined => {
          if (pairs.length === 0) {
            return ''
          }
          if (descriptor.explode) {
            return pairs.map(([key, value]) => `${this.encode(key)}=${this.encode(value)}`).join(',')
          }
          return pairs.map(([key, value]) => `${this.encode(key)},${this.encode(value)}`).join(',')
        })
      })
      .toTry()
  }

  protected schema(descriptor: HeaderSchema, name: string, data: Primitive, path: string): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value) => this.schemaSerialize(descriptor, value, path))
      .map((value) => (isNil(value) ? value : this.encode(value)))
  }

  protected getHeaderValue<T extends ParameterValue>(
    descriptor: HeaderParameterDescriptor,
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
