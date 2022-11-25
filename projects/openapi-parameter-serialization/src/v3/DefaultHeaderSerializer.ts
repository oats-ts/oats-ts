import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { failure, fluent, fromArray, fromRecord, isFailure, isSuccess, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
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

export class DefaultHeaderSerializer<T> extends BaseSerializer implements HeadersSerializer<T> {
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
      .flatMap((value): Try<string | undefined> => {
        return isNil(value)
          ? success(undefined)
          : fluent(this.values.serialize(dsl.value, value, name, path)).map((value) => this.encode(value))
      })
      .toTry()
  }

  protected simpleArray(dsl: HeaderArray, name: string, data: PrimitiveArray, path: string): Try<string | undefined> {
    return fluent(this.getHeaderValue(dsl, path, data))
      .flatMap((value): Try<string | undefined> => {
        if (isNil(value)) {
          return success(undefined)
        }
        // TODO do we need to encode here???
        const serializedValues = fromArray(
          value
            .filter((item) => !isNil(item))
            .map((item) =>
              fluent(this.values.serialize(dsl.items, item, name, path)).map((value) => this.encode(value)),
            ),
        )
        return fluent(serializedValues).map((values) => values.join(','))
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
      .flatMap((value): Try<string | undefined> => {
        if (isNil(value)) {
          return success(undefined)
        }
        const kvPairsTry = fluent(
          fromRecord(
            entries(dsl.properties)
              .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
              .reduce((pairs, [key, valueDsl]) => {
                const strKey = this.encode(key)
                const strValue = fluent(this.values.serialize(valueDsl, value[key], key, this.append(path, key))).map(
                  (value) => this.encode(value),
                )
                pairs[strKey] = strValue
                return pairs
              }, {} as Record<string, Try<string>>),
          ),
        ).map((pairs) => entries(pairs))

        if (dsl.explode) {
          return kvPairsTry.map((pairs) => pairs.map(([key, value]) => `${key}=${value}`).join(','))
        }
        return kvPairsTry.map((pairs) => pairs.map(([key, value]) => `${key},${value}`).join(','))
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
