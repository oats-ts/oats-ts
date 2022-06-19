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
  ValidatorDsl,
  ValueDsl,
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
  <T extends PrimitiveArray>(
    items: ValueDsl<T[number]>,
    config: Partial<DslConfig> = {},
  ): ArrayDsl<T, P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'array',
    location,
    style,
    items,
  })

export const objectDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  <T extends PrimitiveRecord>(
    properties: { [P in keyof T]: ValueDsl<T[P]> },
    config: Partial<DslConfig> = {},
  ): ObjectDsl<T, P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'object',
    location,
    style,
    properties,
  })

export function stringDsl<T extends string = string>(validator?: ValidatorDsl<T>): StringDsl<T> {
  return {
    type: 'string',
    validator,
  }
}

export function numberDsl<T extends number = number>(validator?: ValidatorDsl<T>): NumberDsl<T> {
  return {
    type: 'number',
    validator,
  }
}

export function booleanDsl<T extends boolean = boolean>(validator?: ValidatorDsl<T>): BooleanDsl<T> {
  return {
    type: 'boolean',
    validator,
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
