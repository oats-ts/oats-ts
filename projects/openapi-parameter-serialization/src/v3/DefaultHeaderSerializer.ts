import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { failure, fluent, fromRecord, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import { Base } from './Base'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  HeaderDslRoot,
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  HeadersSerializer,
  HeaderDsl,
  HeaderPrimitive,
  HeaderArray,
  HeaderObject,
} from './types'
import { entries, isNil } from './utils'

export class DefaultHeaderSerializer<T> extends Base implements HeadersSerializer<T> {
  constructor(protected readonly dsl: HeaderDslRoot<T>) {
    super()
  }

  protected basePath(): string {
    return 'headers'
  }

  public serialize(input: T): Try<RawHttpHeaders> {
    const serializedParts = Object.keys(this.dsl.schema).reduce((parts: Record<string, Try<string>>, _key: string) => {
      const key = _key as keyof T & string
      const serializer = this.dsl.schema[key as keyof T]
      const inputValue = input?.[key as keyof T]
      const value = this.parameter(serializer, key, inputValue, this.append(this.basePath(), key))
      // Only add the stuff that failed or succeeded but is not undefined
      if ((isSuccess(value) && !isNil(value.data)) || isFailure(value)) {
        parts[key.toString().toLowerCase()] = value as Try<string>
      }
      return parts
    }, {})
    return fromRecord(serializedParts)
  }

  protected parameter(dsl: HeaderDsl, name: string, value: any, path: string): Try<string | undefined> {
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
      default:
        throw unexpectedStyle(style, ['simple'])
    }
  }

  protected simplePrimitive(
    dsl: HeaderPrimitive,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(dsl, path, data))
      .map((value) => (isNil(value) ? undefined : this.encode(value?.toString())))
      .toTry()
  }

  protected simpleArray(dsl: HeaderArray, name: string, data: PrimitiveArray, path: string): Try<string | undefined> {
    return fluent(this.getHeaderValue(dsl, path, data))
      .map((value) => {
        if (isNil(value)) {
          return undefined
        }
        // TODO do we need to encode here???
        return value
          .filter((item) => !isNil(item))
          .map((item) => this.encode(item?.toString()))
          .join(',')
      })
      .toTry()
  }

  protected simpleObject(
    dsl: HeaderObject,
    name: string,
    data: PrimitiveRecord,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getHeaderValue(dsl, path, data))
      .map((value) => {
        if (isNil(value)) {
          return undefined
        }
        const kvPairs = entries(value)
          .filter(([, value]) => !isNil(value))
          .map(([key, value]): [string, string] => [this.encode(key), this.encode(value?.toString())])
        if (dsl.explode) {
          return kvPairs.map(([key, value]) => `${key}=${value}`).join(',')
        }
        return kvPairs.map(([key, value]) => `${key},${value}`).join(',')
      })
      .toTry()
  }

  protected getHeaderValue<T extends ParameterValue>(
    dsl: HeaderDsl,
    path: string,
    value: T | undefined,
  ): Try<T | undefined> {
    if (!isNil(value)) {
      return success(value)
    }
    if (!dsl.required) {
      return success(undefined)
    }
    return failure({
      message: `should not be ${value}`,
      path,
      severity: 'error',
    })
  }
}
