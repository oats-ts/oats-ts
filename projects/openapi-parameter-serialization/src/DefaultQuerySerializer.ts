import {
  ArrayParameterRule,
  MimeTypeParameterRule,
  ObjectParameterRule,
  PrimitiveParameterRule,
  QueryDescriptorRule,
  QueryParameterRule,
} from '@oats-ts/rules'
import { failure, fluent, fromArray, isFailure, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, PrimitiveArray, PrimitiveRecord, QuerySerializer } from './types'
import { entries, isNil } from './utils'

export class DefaultQuerySerializer<T> extends BaseSerializer implements QuerySerializer<T> {
  constructor(protected readonly parameters: QueryDescriptorRule<T>) {
    super()
  }

  protected basePath(): string {
    return 'query'
  }

  public serialize(input: T): Try<string | undefined> {
    const validationResult = this.validate(this.parameters.schema, input, this.basePath())
    if (isFailure(validationResult)) {
      return validationResult
    }
    const serializedParts = fromArray(
      Object.keys(this.parameters.parameters).map((name: string) => {
        const key = name as keyof T & string
        const descriptor: QueryParameterRule = this.parameters.parameters[key]
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

  protected parameter(descriptor: QueryParameterRule, name: string, value: any, path: string): Try<string[]> {
    if (descriptor.structure.type === 'mime-type') {
      return this.schema(descriptor as QueryParameterRule<MimeTypeParameterRule>, name, value, path)
    }
    switch (descriptor.style) {
      case 'form': {
        switch (descriptor.structure.type) {
          case 'primitive':
            return this.formPrimitive(descriptor as QueryParameterRule<PrimitiveParameterRule>, name, value, path)
          case 'array':
            return this.formArray(descriptor as QueryParameterRule<ArrayParameterRule>, name, value, path)
          case 'object':
            return this.formObject(descriptor as QueryParameterRule<ObjectParameterRule>, name, value, path)
          default: {
            throw unexpectedType((descriptor as QueryParameterRule).structure.type)
          }
        }
      }
      case 'pipeDelimited': {
        switch (descriptor.structure.type) {
          case 'array':
            return this.pipeDelimitedArray(descriptor as QueryParameterRule<ArrayParameterRule>, name, value, path)
          default:
            throw unexpectedType(descriptor.structure.type, ['array'])
        }
      }
      case 'spaceDelimited': {
        switch (descriptor.structure.type) {
          case 'array':
            return this.spaceDelimitedArray(descriptor as QueryParameterRule<ArrayParameterRule>, name, value, path)
          default:
            throw unexpectedType(descriptor.structure.type, ['array'])
        }
      }
      case 'deepObject': {
        switch (descriptor.structure.type) {
          case 'object':
            return this.deepObjectObject(descriptor as QueryParameterRule<ObjectParameterRule>, name, value, path)
          default:
            throw unexpectedType(descriptor.structure.type, ['object'])
        }
      }
      default:
        throw unexpectedStyle(descriptor.style, ['form', 'pipeDelimited', 'spaceDelimited', 'deepObject'])
    }
  }

  protected formPrimitive(
    descriptor: QueryParameterRule<PrimitiveParameterRule>,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string[]> {
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

  protected formArray(
    descriptor: QueryParameterRule<ArrayParameterRule>,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string[]> {
    return this.delimitedArray(descriptor, ',', path, data, name)
  }

  protected formObject(
    descriptor: QueryParameterRule<ObjectParameterRule>,
    name: string,
    data: PrimitiveRecord,
    path: string,
  ): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .flatMap((value): Try<string[]> => {
        if (isNil(value)) {
          return success([])
        }
        return this.objectToKeyValuePairs(descriptor.structure.properties, value, path).map((kvPairs): string[] => {
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
    descriptor: QueryParameterRule<ArrayParameterRule>,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string[]> {
    return this.delimitedArray(descriptor, '|', path, data, name)
  }

  protected spaceDelimitedArray(
    descriptor: QueryParameterRule<ArrayParameterRule>,
    name: string,
    data: PrimitiveArray,
    path: string,
  ): Try<string[]> {
    return this.delimitedArray(descriptor, this.encode(' '), path, data, name)
  }

  protected deepObjectObject(
    descriptor: QueryParameterRule<ObjectParameterRule>,
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

  protected schema(
    descriptor: QueryParameterRule<MimeTypeParameterRule>,
    name: string,
    data: any,
    path: string,
  ): Try<string[]> {
    return fluent(this.getQueryValue(descriptor, path, data))
      .flatMap((value) => this.schemaSerialize(descriptor.structure, value, path))
      .map((value) => (isNil(value) ? [] : [`${this.encode(name)}=${this.encode(value)}`]))
  }

  protected delimitedArray(
    descriptor: QueryParameterRule<ArrayParameterRule>,
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
        return this.arrayToValues(descriptor.structure.items, value, path).map((values) => {
          if (descriptor.explode) {
            return values.length === 0 ? [] : values.map((item) => `${keyStr}=${this.encode(item?.toString())}`)
          }
          return [`${keyStr}=${values.map((item) => this.encode(item?.toString())).join(delimiter)}`]
        })
      })
      .toTry()
  }

  protected getQueryValue<T extends ParameterValue>(
    descriptor: QueryParameterRule,
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
