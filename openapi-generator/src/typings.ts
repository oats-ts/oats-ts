import { ReferenceObject } from 'openapi3-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Issue } from '@oats-ts/validators'

export type OpenAPIUtils = {
  dereferenceUri<T>(uri: string): T
  dereference<T>(input: T | ReferenceObject): T
  nameOf(input: any): string
  uriOf(input: any): string
}

export type GeneratorContext = OpenAPIReadOutput & {
  utils: OpenAPIUtils
  issues: Issue[]
}

export type GeneratorInput<T> = {
  data: T
  uri: string
}
