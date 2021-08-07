import { ReferenceObject } from '@oats-ts/json-schema-model'

export type JsonSchemaGeneratorContext<Doc, Target extends string, Dep> = {
  readonly document: Doc
  readonly documents: Doc[]
  dereference<T>(input: string | T | ReferenceObject, deep?: boolean): T
  nameOf(input: any, target?: Target): string
  pathOf(input: any, target: Target): string
  uriOf(input: any): string
  referenceOf<T>(input: any, target: Target): T
  dependenciesOf(fromPath: string, input: any, target: Target): Dep[]
}

export type InferredType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'object'
  | 'array'
  | 'record'
  | 'union'
  | 'intersection'
  | 'unknown'
  | 'ref'
