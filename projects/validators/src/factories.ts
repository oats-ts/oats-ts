import {
  AnySchema,
  ArraySchema,
  BooleanSchema,
  IntegerSchema,
  IntersectionSchema,
  ItemsSchema,
  LazySchema,
  LiteralSchema,
  MinLengthSchema,
  NilSchema,
  NumberSchema,
  ObjectSchema,
  OptionalSchema,
  RecordSchema,
  RestrictKeysSchema,
  Schema,
  ShapeInput,
  ShapeSchema,
  StringSchema,
  TupleSchema,
  UnionSchema,
} from './typings'

export function any(): AnySchema {
  return { type: 'any' }
}

export function array(schema?: Schema): ArraySchema {
  return { type: 'array', schema }
}

export function boolean(schema?: Schema): BooleanSchema {
  return { type: 'boolean', schema }
}

export function integer(schema?: Schema): IntegerSchema {
  return { type: 'integer', schema }
}

export function intersection(schemas: Schema[]): IntersectionSchema {
  return { type: 'intersection', schemas }
}

export function items(schema: Schema): ItemsSchema {
  return { type: 'items', schema }
}

export function lazy(schema: () => Schema): LazySchema {
  return { type: 'lazy', schema }
}

export function literal(value: any): LiteralSchema {
  return { type: 'literal', value }
}

export function minLength(length: number): MinLengthSchema {
  return { type: 'min-length', minLength: length }
}

export function nil(): NilSchema {
  return { type: 'nil' }
}

export function number(schema?: Schema): NumberSchema {
  return { type: 'number', schema }
}

export function object(schema?: Schema): ObjectSchema {
  return { type: 'object', schema }
}

export function optional(schema: Schema): OptionalSchema {
  return { type: 'optional', schema }
}

export function record(keys: Schema, values: Schema): RecordSchema {
  return { type: 'record', keys, values }
}

export function restrictKeys(keys: string[]): RestrictKeysSchema {
  return { type: 'restrict-keys', keys }
}

export function shape<T = Record<string, any>>(shape: ShapeInput<T>): ShapeSchema {
  return { type: 'shape', shape: shape as Record<string, Schema> }
}

export function string(schema?: Schema): StringSchema {
  return { type: 'string', schema }
}

export function tuple(schemas: Schema[]): TupleSchema {
  return { type: 'tuple', schemas }
}

export function union(schemas: Record<string, Schema>): UnionSchema {
  return { type: 'union', schemas }
}
