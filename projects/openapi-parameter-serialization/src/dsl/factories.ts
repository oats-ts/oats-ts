import {
  ArrayDsl,
  BooleanDsl,
  EnumDsl,
  LiteralDsl,
  NumberDsl,
  ObjectDsl,
  DslConfig,
  DslLocation,
  DslStyle,
  Primitive,
  PrimitiveArray,
  PrimitiveDsl,
  PrimitiveRecord,
  StringDsl,
  ValueDsl,
  PropertiesDsl,
  ItemsDsl,
  OptionalDsl,
} from './types'

export const primitiveDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  <T extends Primitive>(value: ValueDsl<T>, config: Partial<DslConfig> = {}): PrimitiveDsl<T, P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'primitive',
    location,
    style,
    value,
  })

export const arrayDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  <T extends PrimitiveArray>(items: ItemsDsl<T>, config: Partial<DslConfig> = {}): ArrayDsl<T, P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'array',
    location,
    style,
    items,
  })

export const objectDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  <T extends PrimitiveRecord>(properties: PropertiesDsl<T>, config: Partial<DslConfig> = {}): ObjectDsl<T, P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'object',
    location,
    style,
    properties,
  })

export function optionalDsl<T extends Primitive>(validator: ValueDsl<T>): OptionalDsl<T> {
  return {
    type: 'optional',
    dsl: validator,
  }
}

export function stringDsl<T extends string = string>(validator?: ValueDsl<T>): StringDsl<T> {
  return {
    type: 'string',
    dsl: validator,
  }
}

export function numberDsl<T extends number = number>(validator?: ValueDsl<T>): NumberDsl<T> {
  return {
    type: 'number',
    dsl: validator,
  }
}

export function booleanDsl<T extends boolean = boolean>(validator?: ValueDsl<T>): BooleanDsl<T> {
  return {
    type: 'boolean',
    dsl: validator,
  }
}

export function enumDsl<T extends Primitive>(values: T[]): EnumDsl<T> {
  return {
    type: 'enum',
    values,
  }
}

export function literalDsl<T extends Primitive>(value: T): LiteralDsl<T> {
  return {
    type: 'literal',
    value,
  }
}
