import { CookieValue } from '@oats-ts/openapi-http'
import { failure, fluent, fromRecord, success, Try } from '@oats-ts/try'
import { isNil } from './utils'
import { BaseDeserializer } from './BaseDeserializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, CookieDeserializer } from './types'
import {
  CookieDescriptorRule,
  CookieParameterRule,
  MimeTypeParameterRule,
  PrimitiveParameterRule,
} from '@oats-ts/rules'

export class DefaultCookieDeserializer<T> extends BaseDeserializer implements CookieDeserializer<T> {
  constructor(protected readonly parameters: CookieDescriptorRule<T>) {
    super()
  }

  public deserialize(input: string): Try<T> {
    return fluent(this.deserializeCookie(input, this.basePath()))
      .flatMap((rawData) => {
        const parsedData = Object.keys(this.parameters.parameters).reduce(
          (acc: Record<string, Try<ParameterValue>>, _key: string) => {
            const key = _key as keyof T & string
            const values = rawData.filter(({ name }) => name === key)
            const paramrule = this.parameters.parameters[key]
            acc[key] = this.deserializeParameter(paramrule, key, values, this.append(this.basePath(), key))
            return acc
          },
          {},
        )
        return fromRecord(parsedData) as Try<T>
      })
      .flatMap((value) => this.validate<T>(this.parameters.schema, value, this.basePath()))
      .toTry()
  }

  protected basePath(): string {
    return 'cookies'
  }

  protected deserializeParameter(
    rule: CookieParameterRule,
    name: string,
    data: CookieValue[],
    path: string,
  ): Try<ParameterValue> {
    if (rule.structure.type === 'mime-type') {
      return this.schema(rule as CookieParameterRule<MimeTypeParameterRule>, name, data, path)
    }
    switch (rule.style) {
      case 'form': {
        switch (rule.structure.type) {
          case 'primitive':
            return this.formPrimitive(rule as CookieParameterRule<PrimitiveParameterRule>, name, data, path)
          default: {
            throw unexpectedType(rule.structure.type, ['primitive'])
          }
        }
      }
      default:
        throw unexpectedStyle(rule.style, ['form'])
    }
  }

  protected formPrimitive(
    rule: CookieParameterRule<PrimitiveParameterRule>,
    name: string,
    data: CookieValue[],
    path: string,
  ): Try<Primitive> {
    return fluent(this.getCookieValue(rule, data, path)).flatMap((value) => {
      if (!rule.required && isNil(value)) {
        return success(undefined)
      }
      return this.values.deserialize(rule.structure.value, isNil(value) ? value : this.decode(value), path)
    })
  }

  protected schema(
    rule: CookieParameterRule<MimeTypeParameterRule>,
    name: string,
    data: CookieValue[],
    path: string,
  ): Try<any> {
    return fluent(this.getCookieValue(rule, data, path))
      .map((value) => (isNil(value) ? value : this.decode(value)))
      .flatMap((value) => this.schemaDeserialize(rule.structure, value, path))
  }

  protected deserializeCookie(cookie: string | undefined, path: string): Try<CookieValue[]> {
    if (isNil(cookie) || cookie.length === 0) {
      return success([])
    }

    try {
      const sliced = cookie
        .trim() // Remove any possible excess whitespace from beginning and end
        .split('; ') // Split on semicolon
        .map((tuple) => tuple.split('=')) // Split key=value tuples on "="

      return success(sliced.map(([rawKey, value]): CookieValue => ({ name: this.decode(rawKey), value })))
    } catch (e) {
      return failure({
        message: (e as Error)?.message,
        path,
        severity: 'error',
      })
    }
  }

  protected getCookieValue(rule: CookieParameterRule, data: CookieValue[], path: string): Try<string | undefined> {
    switch (data.length) {
      case 0: {
        return rule.required ? failure({ message: `missing cookie`, path, severity: 'error' }) : success(undefined)
      }
      case 1: {
        return success(data[0]?.value)
      }
      default: {
        return failure({
          message: `duplicate cookie, should occur maximum once (found ${data.length} times)`,
          path,
          severity: 'error',
        })
      }
    }
  }
}
