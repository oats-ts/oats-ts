import {
  CookieDescriptorRule,
  CookieParameterRule,
  MimeTypeParameterRule,
  PrimitiveParameterRule,
} from '@oats-ts/rules'
import { failure, fluent, fromArray, isFailure, success, Try } from '@oats-ts/try'
import { BaseSerializer } from './BaseSerializer'
import { unexpectedStyle, unexpectedType } from './errors'
import { ParameterValue, Primitive, CookieSerializer } from './types'
import { isNil } from './utils'

export class DefaultCookieSerializer<T> extends BaseSerializer implements CookieSerializer<T> {
  constructor(protected readonly parameters: CookieDescriptorRule<T>) {
    super()
  }

  protected basePath(): string {
    return 'cookies'
  }

  public serialize(input: T): Try<string | undefined> {
    const validationResult = this.validate(this.parameters.schema, input, this.basePath())
    if (isFailure(validationResult)) {
      return validationResult
    }
    const serializedParts = Object.keys(this.parameters.parameters).map(
      (_key: string): Try<[string, string | undefined]> => {
        const key = _key as string & keyof T
        const paramrule = this.parameters.parameters[key]
        const cookieValue = input?.[key]
        const serialized = this.serializeParameter(paramrule, key, cookieValue, this.append(this.basePath(), key))
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
    rule: CookieParameterRule,
    name: string,
    value: any,
    path: string,
  ): Try<string | undefined> {
    if (rule.structure.type === 'mime-type') {
      return this.schema(rule as CookieParameterRule<MimeTypeParameterRule>, name, value, path)
    }
    switch (rule.style) {
      case 'form': {
        switch (rule.structure.type) {
          case 'primitive':
            return this.formPrimitive(rule as CookieParameterRule<PrimitiveParameterRule>, name, value, path)
          default: {
            throw unexpectedType(rule.structure.type, ['primitive'])
          }
        }
      }
      default:
        throw unexpectedStyle(rule.style, ['simple'])
    }
  }

  protected formPrimitive(
    rule: CookieParameterRule<PrimitiveParameterRule>,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getCookieValue(rule, path, data))
      .flatMap(
        (value): Try<string | undefined> =>
          isNil(value)
            ? success(undefined)
            : fluent(this.values.serialize(rule.structure.value, value, path)).map((value) => this.encode(value)),
      )
      .toTry()
  }

  protected schema(
    rule: CookieParameterRule<MimeTypeParameterRule>,
    name: string,
    data: Primitive,
    path: string,
  ): Try<string | undefined> {
    return fluent(this.getCookieValue(rule, path, data))
      .flatMap((value) => this.schemaSerialize(rule.structure, value, path))
      .map((value) => (isNil(value) ? value : this.encode(value)))
  }

  protected getCookieValue<T extends ParameterValue>(
    rule: CookieParameterRule,
    path: string,
    value: T | undefined,
  ): Try<T> {
    if (!isNil(value)) {
      return success(value)
    }
    if (!rule.required) {
      return success(undefined as unknown as T)
    }
    return failure({
      message: `should not be ${value}`,
      path,
      severity: 'error',
    })
  }
}
