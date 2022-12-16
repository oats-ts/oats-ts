import { RawHttpHeaders } from '@oats-ts/openapi-http'
import {
  ArrayParameterRule,
  HeaderDescriptorRule,
  HeaderParameterRule,
  MimeTypeParameterRule,
  ObjectParameterRule,
  PrimitiveParameterRule,
} from '@oats-ts/rules'
import { failure, fluent, fromRecord, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, PrimitiveArray, PrimitiveRecord, HeadersSerializer } from './types'
import { isNil } from './utils'

export class DefaultHeaderSerializer<T> extends BaseSerializer implements HeadersSerializer<T> {
  constructor(protected readonly parameters: HeaderDescriptorRule<T>) {
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
    const serializedParts = Object.keys(this.parameters.parameters).reduce(
      (parts: Record<string, Try<string>>, _key: string) => {
        const key = _key as keyof T & string
        const descriptor = this.parameters.parameters[key as keyof T]
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
    descriptor: HeaderParameterRule,
    name: string,
    value: any,
    path: string,
  ): Try<string | undefined> {
    if (descriptor.structure.type === 'mime-type') {
      return this.schema(descriptor as HeaderParameterRule<MimeTypeParameterRule>, name, value, path)
    }
    switch (descriptor.style) {
      case 'simple': {
        switch (descriptor.structure.type) {
          case 'primitive':
            return this.simplePrimitive(descriptor as HeaderParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.simpleArray(descriptor as HeaderParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.simpleObject(descriptor as HeaderParameterRule<ObjectParameterRule>, name, value, path)
          default: {
            throw unexpectedType((descriptor as HeaderParameterRule).structure.type)
          }
        }
      }
      default:
        throw unexpectedStyle(descriptor.style, ['simple'])
    }
  }

  protected simplePrimitive(
    descriptor: HeaderParameterRule<PrimitiveParameterRule>,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value): Try<string | undefined> => {
        return isNil(value)
          ? success(undefined)
          : fluent(this.values.serialize(descriptor.structure.value, value, path)).map((value) => this.encode(value))
      })
      .toTry()
  }

  protected simpleArray(
    descriptor: HeaderParameterRule<ArrayParameterRule>,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value): Try<string | undefined> => {
        if (isNil(value)) {
          return success(undefined)
        }
        return this.arrayToValues(descriptor.structure.items, value, path).map((items) =>
          items.map((item) => this.encode(item)).join(','),
        )
      })
      .toTry()
  }

  protected simpleObject(
    descriptor: HeaderParameterRule<ObjectParameterRule>,
    name: string,
    data: PrimitiveRecord,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value): Try<string | undefined> => {
        if (isNil(value)) {
          return success(undefined)
        }
        return this.objectToKeyValuePairs(descriptor.structure.properties, value, path).map(
          (pairs): string | undefined => {
            if (pairs.length === 0) {
              return ''
            }
            if (descriptor.explode) {
              return pairs.map(([key, value]) => `${this.encode(key)}=${this.encode(value)}`).join(',')
            }
            return pairs.map(([key, value]) => `${this.encode(key)},${this.encode(value)}`).join(',')
          },
        )
      })
      .toTry()
  }

  protected schema(
    descriptor: HeaderParameterRule<MimeTypeParameterRule>,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(descriptor, path, data))
      .flatMap((value) => this.schemaSerialize(descriptor.structure, value, path))
      .map((value) => (isNil(value) ? value : this.encode(value)))
  }

  protected getHeaderValue<T extends ParameterValue>(
    descriptor: HeaderParameterRule,
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
