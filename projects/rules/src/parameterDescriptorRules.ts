import { CookieParameterRule, HeaderParameterRule, PathParameterRule, QueryParameterRule } from './parameterRules'
import { PathSegment } from './pathSegment'
import { SchemaRule } from './schemaRules'

export type QueryDescriptorRule<T> = {
  parameters: Record<keyof T, QueryParameterRule>
  schema: SchemaRule
}

export type PathDescriptorRule<T> = {
  parameters: Record<keyof T, PathParameterRule>
  pathSegments: PathSegment[]
  matcher: RegExp
  schema: SchemaRule
}

export type HeaderDescriptorRule<T> = {
  parameters: Record<keyof T, HeaderParameterRule>
  schema: SchemaRule
}

export type CookieDescriptorRule<T> = {
  parameters: Record<keyof T, CookieParameterRule>
  schema: SchemaRule
}

export type ParameterDescriptorRule<T> =
  | QueryDescriptorRule<T>
  | PathDescriptorRule<T>
  | HeaderDescriptorRule<T>
  | CookieDescriptorRule<T>
