import {
  AnySchemaRule,
  ArraySchemaRule,
  BooleanSchemaRule,
  IntegerSchemaRule,
  IntersectionSchemaRule,
  ItemsSchemaRule,
  LazySchemaRule,
  LiteralSchemaRule,
  MaxLengthSchemaRule,
  MaxPropertiesSchemaRule,
  MinLengthSchemaRule,
  MinPropertiesSchemaRule,
  NilSchemaRule,
  NumberSchemaRule,
  ObjectSchemaRule,
  OptionalSchemaRule,
  RecordSchemaRule,
  RestrictKeysSchemaRule,
  SchemaRule,
  ShapeInput,
  ShapeSchemaRule,
  StringSchemaRule,
  TupleSchemaRule,
  UnionSchemaRule,
} from './schemaRules'

export function any(): AnySchemaRule {
  return { type: 'any' }
}

export function array(schema?: SchemaRule): ArraySchemaRule {
  return { type: 'array', schema }
}

export function boolean(schema?: SchemaRule): BooleanSchemaRule {
  return { type: 'boolean', schema }
}

export function integer(schema?: SchemaRule): IntegerSchemaRule {
  return { type: 'integer', schema }
}

export function intersection(schemas: SchemaRule[]): IntersectionSchemaRule {
  return { type: 'intersection', schemas }
}

export function items(schema: SchemaRule): ItemsSchemaRule {
  return { type: 'items', schema }
}

export function lazy(schema: () => SchemaRule): LazySchemaRule {
  return { type: 'lazy', schema }
}

export function literal(value: any): LiteralSchemaRule {
  return { type: 'literal', value }
}

export function maxLength(length: number): MaxLengthSchemaRule {
  return { type: 'max-length', maxLength: length }
}

export function minLength(length: number): MinLengthSchemaRule {
  return { type: 'min-length', minLength: length }
}

export function maxProperties(length: number): MaxPropertiesSchemaRule {
  return { type: 'max-properties', maxProperties: length }
}

export function minProperties(length: number): MinPropertiesSchemaRule {
  return { type: 'min-properties', minProperties: length }
}

export function nil(): NilSchemaRule {
  return { type: 'nil' }
}

export function number(schema?: SchemaRule): NumberSchemaRule {
  return { type: 'number', schema }
}

export function object(schema?: SchemaRule): ObjectSchemaRule {
  return { type: 'object', schema }
}

export function optional(schema: SchemaRule): OptionalSchemaRule {
  return { type: 'optional', schema }
}

export function record(keys: SchemaRule, values: SchemaRule): RecordSchemaRule {
  return { type: 'record', keys, values }
}

export function restrictKeys(keys: string[]): RestrictKeysSchemaRule {
  return { type: 'restrict-keys', keys }
}

export function shape<T = Record<string, any>>(shape: ShapeInput<T>): ShapeSchemaRule {
  return { type: 'shape', shape: shape as Record<string, SchemaRule> }
}

export function string(schema?: SchemaRule): StringSchemaRule {
  return { type: 'string', schema }
}

export function tuple(schemas: SchemaRule[]): TupleSchemaRule {
  return { type: 'tuple', schemas }
}

export function union(schemas: Record<string, SchemaRule>): UnionSchemaRule {
  return { type: 'union', schemas }
}
