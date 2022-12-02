import { failure, fluent, fromArray, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import {
  ParameterValue,
  Primitive,
  CookieSerializer,
  CookieParameters,
  CookieParameterDescriptor,
  CookiePrimitive,
} from './types'
import { isNil } from './utils'

export class DefaultCookieSerializer<T> extends BaseSerializer implements CookieSerializer<T> {
  constructor(protected readonly parameters: CookieParameters<T>) {
    super()
  }

  protected basePath(): string {
    return 'cookies'
  }

  public serialize(input: T): Try<string | undefined> {
    const serializedParts = Object.keys(this.parameters.descriptor).map(
      (_key: string): Try<[string, string | undefined]> => {
        const key = _key as string & keyof T
        const paramDescriptor = this.parameters.descriptor[key]
        const cookieValue = input?.[key]
        const serialized = this.serializeParameter(paramDescriptor, key, cookieValue, this.append(this.basePath(), key))
        return fluent(serialized).map((value) => [key, value])
      },
    )
    return fluent(fromArray(serializedParts))
      .map((cookies) =>
        cookies.filter(([, value]) => value !== undefined).map(([name, value]) => `${this.encode(name)}=${value}`),
      )
      .map((values) => (values.length === 0 ? undefined : values.join('; ')))
  }

  protected serializeParameter(
    descriptor: CookieParameterDescriptor,
    name: string,
    value: any,
    path: string,
  ): Try<string | undefined> {
    const { style, type } = descriptor
    switch (style) {
      case 'form': {
        switch (type) {
          case 'primitive':
            return this.formPrimitive(descriptor, name, value, path)
          default: {
            throw unexpectedType(type, ['primitive'])
          }
        }
      }
      default:
        throw unexpectedStyle(style, ['simple'])
    }
  }

  protected formPrimitive(
    descriptor: CookiePrimitive,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getCookieValue(descriptor, path, data))
      .flatMap(
        (value): Try<string | undefined> =>
          isNil(value)
            ? success(undefined)
            : fluent(this.values.serialize(descriptor.value, value, path)).map((value) => this.encode(value)),
      )
      .toTry()
  }

  protected getCookieValue<T extends ParameterValue>(
    descriptor: CookieParameterDescriptor,
    path: string,
    value: T | undefined,
  ): Try<T> {
    if (!isNil(value)) {
      return success(value)
    }
    if (!descriptor.required) {
      return success(undefined as unknown as T)
    }
    return failure({
      message: `should not be ${value}`,
      path,
      severity: 'error',
    })
  }
}
