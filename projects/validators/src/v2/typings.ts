export type AnySchema = { type: 'any' }
export type ArraySchema = { type: 'array'; schema?: Schema }
export type BooleanSchema = { type: 'boolean'; schema?: Schema }
export type IntegerSchema = { type: 'integer'; schema?: Schema }
export type IntersectionSchema = { type: 'intersection'; schemas: Schema[] }
export type ItemsSchema = { type: 'items'; schema: Schema }
export type LazySchema = { type: 'lazy'; schema: () => Schema }
export type LiteralSchema = { type: 'literal'; value: any }
export type MinLengthSchema = { type: 'min-length'; minLength: number }
export type NilSchema = { type: 'nil' }
export type NumberSchema = { type: 'number'; schema?: Schema }
export type ObjectSchema = { type: 'object'; schema?: Schema }
export type OptionalSchema = { type: 'optional'; schema: Schema }
export type RecordSchema = { type: 'record'; keys: Schema; values: Schema }
export type RestrictKeysSchema = { type: 'restrict-keys'; keys: string[] }
export type ShapeSchema = { type: 'shape'; shape: Record<string, Schema> }
export type StringSchema = { type: 'string'; schema?: Schema }
export type TupleSchema = { type: 'tuple'; schemas: Schema[] }
export type UnionSchema = { type: 'union'; schemas: Record<string, Schema> }

export type Schema =
  | AnySchema
  | ArraySchema
  | BooleanSchema
  | IntegerSchema
  | IntersectionSchema
  | ItemsSchema
  | LazySchema
  | LiteralSchema
  | MinLengthSchema
  | NilSchema
  | NumberSchema
  | ObjectSchema
  | OptionalSchema
  | RecordSchema
  | RestrictKeysSchema
  | ShapeSchema
  | StringSchema
  | TupleSchema
  | UnionSchema

export type Severity = 'error' | 'warning' | 'info'

export type Issue = {
  severity: Severity
  path: string
  message: string
}
