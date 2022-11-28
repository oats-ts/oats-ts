import { failure, fluent, fromArray, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  Primitive,
  PrimitiveArray,
  PrimitiveRecord,
  QueryArray,
  QueryDsl,
  QueryDslRoot,
  QueryObject,
  QueryPrimitive,
  QuerySerializer,
} from './types'
import { entries, isNil } from './utils'

export class DefaultQuerySerializer<T> extends BaseSerializer implements QuerySerializer<T> {
  constructor(protected readonly dsl: QueryDslRoot<T>) {
    super()
  }

  protected basePath(): string {
    return 'query'
  }

  public serialize(input: T): Try<string | undefined> {
    const serializedParts = fromArray(
      Object.keys(this.dsl.schema).map((name: string) => {
        const key = name as keyof T & string
        const dsl: QueryDsl = this.dsl.schema[key]
        const value = input?.[key] as unknown as ParameterValue
        const path = this.append(this.basePath(), key)
        return this.parameter(dsl, key, value, path)
      }, {}),
    )

    return fluent(serializedParts)
      .map((parts: string[][]): string[] => parts.reduce((flat, arr) => [...flat, ...arr], []))
      .map((parts) => (parts.length === 0 ? undefined : `?${parts.join('&')}`))
      .toTry()
  }

  protected parameter(dsl: QueryDsl, name: string, value: any, path: string): Try<string[]> {
    const { style, type } = dsl
    switch (style) {
      case 'form': {
        switch (type) {
          case 'primitive':
            return this.formPrimitive(dsl, name, value, path)
          case 'array':
            return this.formArray(dsl, name, value, path)
          case 'object':
            return this.formObject(dsl, name, value, path)
          default: {
            throw unexpectedType(type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (type) {
          case 'array':
            return this.pipeDelimitedArray(dsl, name, value, path)
          default:
            throw unexpectedType(type, ['array'])
        }
      }
      case 'spaceDelimited': {
        switch (type) {
          case 'array':
            return this.spaceDelimitedArray(dsl, name, value, path)
          default:
            throw unexpectedType(type, ['array'])
        }
      }
      case 'deepObject': {
        switch (type) {
          case 'object':
            return this.deepObjectObject(dsl, name, value, path)
          default:
            throw unexpectedType(type, ['object'])
        }
      }
      default:
        throw unexpectedStyle(style, ['form', 'pipeDelimited', 'spaceDelimited', 'deepObject'])
    }
  }

  protected formPrimitive(dsl: QueryPrimitive, name: string, data: Primitive, path: string): Try<string[]> {
    return fluent(this.getQueryValue(dsl, path, data))
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

  protected formArray(dsl: QueryArray, name: string, data: PrimitiveArray, path: string): Try<string[]> {
    return this.delimitedArray(dsl, ',', path, data, name)
  }

  protected formObject(dsl: QueryObject, name: string, data: PrimitiveRecord, path: string): Try<string[]> {
    return fluent(this.getQueryValue(dsl, path, data))
      .flatMap((value): Try<string[]> => {
        if (isNil(value)) {
          return success([])
        }
        return this.objectToKeyValuePairs(dsl.properties, value, path).map((kvPairs): string[] => {
          if (kvPairs.length === 0) {
            return []
          }
          if (dsl.explode) {
            return kvPairs.map(([key, value]) => `${this.encode(key)}=${this.encode(value)}`)
          }
          const valStr = kvPairs.map(([key, value]) => [this.encode(key), this.encode(value)].join(',')).join(',')
          return [`${this.encode(name)}=${valStr}`]
        })
      })
      .toTry()
  }

  protected pipeDelimitedArray(dsl: QueryArray, name: string, data: PrimitiveArray, path: string): Try<string[]> {
    return this.delimitedArray(dsl, '|', path, data, name)
  }

  protected spaceDelimitedArray(dsl: QueryArray, name: string, data: PrimitiveArray, path: string): Try<string[]> {
    return this.delimitedArray(dsl, this.encode(' '), path, data, name)
  }

  protected deepObjectObject(dsl: QueryObject, name: string, data: PrimitiveRecord, path: string): Try<string[]> {
    return fluent(this.getQueryValue(dsl, path, data))
      .flatMap((value) => {
        if (!dsl.explode) {
          return failure({
            message: `can only be serialized with explode=true`,
            path,
            severity: 'error',
          })
        }

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

  protected delimitedArray(
    dsl: QueryArray,
    delimiter: string,
    path: string,
    data: PrimitiveArray,
    name: string,
  ): Try<string[]> {
    return fluent(this.getQueryValue(dsl, path, data))
      .flatMap((value): Try<string[]> => {
        if (isNil(value)) {
          return success([])
        }
        const keyStr = this.encode(name)
        return this.arrayToValues(dsl.items, value, path).map((values) => {
          if (dsl.explode) {
            return values.length === 0 ? [] : values.map((item) => `${keyStr}=${this.encode(item?.toString())}`)
          }
          return [`${keyStr}=${values.map((item) => this.encode(item?.toString())).join(delimiter)}`]
        })
      })
      .toTry()
  }

  protected getQueryValue<T extends ParameterValue>(
    dsl: QueryDsl,
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