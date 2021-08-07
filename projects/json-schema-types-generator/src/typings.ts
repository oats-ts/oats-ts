import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'

export type TypesGeneratorConfig = {
  /**
   * If set to true, the description and deprecated fields in SchemaObjects will be used to generate
   * documentation for the generated types (or possibly enums). Otherwise docs will be omitted.
   */
  documentation: boolean
  /**
   * If set to true, named "enum" type SchemaObjects will be turned into typescript enums (present when transpiled),
   * otherwise they will be turned into string union types (no trace when transpiled).
   */
  enums: boolean
}

export type TypesGeneratorContext = {
  target: string
  schemas: Referenceable<SchemaObject>[]
  dereference(input: string | Referenceable<SchemaObject>, deep?: boolean): Referenceable<SchemaObject>
  nameOf(input: Referenceable<SchemaObject>, target?: string): string
  pathOf(input: any, target: string): string
  discriminatorsOf(input: Referenceable<SchemaObject>): Record<string, string>
  namedReferencesOf(input: Referenceable<SchemaObject>): SchemaObject[]
}
