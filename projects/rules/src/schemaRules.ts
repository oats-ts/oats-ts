export type AnySchemaRule = { type: 'any' }
export type ArraySchemaRule = { type: 'array'; schema?: SchemaRule }
export type BooleanSchemaRule = { type: 'boolean'; schema?: SchemaRule }
export type IntegerSchemaRule = { type: 'integer'; schema?: SchemaRule }
export type IntersectionSchemaRule = { type: 'intersection'; schemas: SchemaRule[] }
export type ItemsSchemaRule = { type: 'items'; schema: SchemaRule }
export type LazySchemaRule = { type: 'lazy'; schema: () => SchemaRule }
export type LiteralSchemaRule = { type: 'literal'; value: any }
export type MaxLengthSchemaRule = { type: 'max-length'; maxLength: number }
export type MaxPropertiesSchemaRule = { type: 'max-properties'; maxProperties: number }
export type MinLengthSchemaRule = { type: 'min-length'; minLength: number }
export type MinPropertiesSchemaRule = { type: 'min-properties'; minProperties: number }
export type NilSchemaRule = { type: 'nil' }
export type NumberSchemaRule = { type: 'number'; schema?: SchemaRule }
export type ObjectSchemaRule = { type: 'object'; schema?: SchemaRule }
export type OptionalSchemaRule = { type: 'optional'; schema: SchemaRule }
export type RecordSchemaRule = { type: 'record'; keys: SchemaRule; values: SchemaRule }
export type RestrictKeysSchemaRule = { type: 'restrict-keys'; keys: string[] }
export type ShapeSchemaRule = { type: 'shape'; shape: Record<string, SchemaRule> }
export type StringSchemaRule = { type: 'string'; schema?: SchemaRule }
export type TupleSchemaRule = { type: 'tuple'; schemas: SchemaRule[] }
export type UnionSchemaRule = { type: 'union'; schemas: Record<string, SchemaRule> }

export type SchemaRule =
  | AnySchemaRule
  | ArraySchemaRule
  | BooleanSchemaRule
  | IntegerSchemaRule
  | IntersectionSchemaRule
  | ItemsSchemaRule
  | LazySchemaRule
  | LiteralSchemaRule
  | MaxLengthSchemaRule
  | MaxPropertiesSchemaRule
  | MinLengthSchemaRule
  | MinPropertiesSchemaRule
  | NilSchemaRule
  | NumberSchemaRule
  | ObjectSchemaRule
  | OptionalSchemaRule
  | RecordSchemaRule
  | RestrictKeysSchemaRule
  | ShapeSchemaRule
  | StringSchemaRule
  | TupleSchemaRule
  | UnionSchemaRule

export type ShapeInput<T> = {
  [P in keyof T]?: SchemaRule
}
