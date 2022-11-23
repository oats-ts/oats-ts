import { failure, fluent, fromArray, success, Try } from '@oats-ts/try'
import { Base } from './Base'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, CookieSerializer, CookieDslRoot, CookieDsl, CookiePrimitive } from './types'
import { isNil } from './utils'

export class DefaultCookieSerializer<T> extends Base implements CookieSerializer<T> {
  constructor(private dsl: CookieDslRoot<T>) {
    super()
  }

  protected basePath(): string {
    return 'cookies'
  }

  public serialize(input: T): Try<string> {
    const serializedParts = Object.keys(this.dsl.schema).map((_key: string): Try<[string, string | undefined]> => {
      const key = _key as string & keyof T
      const paramDsl = this.dsl.schema[key]
      const cookieValue = input?.[key]
      const serialized = this.parameter(paramDsl, key, cookieValue, this.append(this.basePath(), key))
      return fluent(serialized).map((value) => [key, value])
    })
    return fluent(fromArray(serializedParts))
      .map((cookies) =>
        cookies.filter(([, value]) => value !== undefined).map(([name, value]) => `${this.encode(name)}=${value}`),
      )
      .map((values) => values.join('; '))
  }

  protected parameter(dsl: CookieDsl, name: string, value: any, path: string): Try<string | undefined> {
    const { style, type } = dsl
    switch (style) {
      case 'form': {
        switch (type) {
          case 'primitive':
            return this.formPrimitive(dsl, name, value, path)
          default: {
            throw unexpectedType(type, ['primitive'])
          }
        }
      }
      default:
        throw unexpectedStyle(style, ['simple'])
    }
  }

  protected formPrimitive(dsl: CookiePrimitive, name: string, data: Primitive, path: string): Try<string | undefined> {
    return fluent(this.getCookieValue(dsl, path, data))
      .map((value) => (isNil(value) ? undefined : this.encode(value?.toString())))
      .toTry()
  }

  protected getCookieValue<T extends ParameterValue>(dsl: CookieDsl, path: string, value: T | undefined): Try<T> {
    if (!isNil(value)) {
      return success(value)
    }
    if (!dsl.required) {
      return success(undefined as unknown as T)
    }
    return failure({
      message: `should not be ${value}`,
      path,
      severity: 'error',
    })
  }
}
