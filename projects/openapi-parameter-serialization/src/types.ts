import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { ValueParameterRule } from '@oats-ts/rules'
import { Try } from '@oats-ts/try'

export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord
export type ParameterType = Record<string, ParameterValue>

export type RawPath = Record<string, string>
export type RawQuery = Record<string, string[]>

export type ValueDeserializer = {
  deserialize(descriptor: ValueParameterRule, data: Primitive, path: string): Try<Primitive>
}

export type ValueSerializer = {
  serialize(descriptor: ValueParameterRule, data: Primitive, path: string): Try<string | undefined>
}

export type PathSerializer<T> = {
  serialize(params: T): Try<string>
}

export type QuerySerializer<T> = {
  serialize(params: T): Try<string | undefined>
}

export type HeadersSerializer<T> = {
  serialize(params: T): Try<RawHttpHeaders>
}

export type CookieSerializer<T> = {
  serialize(params: T): Try<string | undefined>
}

export type PathDeserializer<T> = {
  deserialize(path: string): Try<T>
}

export type QueryDeserializer<T> = {
  deserialize(query: string): Try<T>
}

export type HeaderDeserializer<T> = {
  deserialize(headers: RawHttpHeaders): Try<T>
}

export type CookieDeserializer<T> = {
  deserialize(cookies: string): Try<T>
}
