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
  PrimitiveDsl,
  StringDsl,
  ValueDsl,
  PropertiesDsl,
  OptionalDsl,
} from './types'

export const primitiveDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  (value: ValueDsl, config: Partial<DslConfig> = {}): PrimitiveDsl<P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'primitive',
    location,
    style,
    value,
  })

export const arrayDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  (items: ValueDsl, config: Partial<DslConfig> = {}): ArrayDsl<P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'array',
    location,
    style,
    items,
  })

export const objectDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, defaultConfg: DslConfig) =>
  (properties: PropertiesDsl, config: Partial<DslConfig> = {}): ObjectDsl<P, S> => ({
    ...defaultConfg,
    ...config,
    type: 'object',
    location,
    style,
    properties,
  })

export function optionalDsl(validator: ValueDsl): OptionalDsl {
  return {
    type: 'optional',
    dsl: validator,
  }
}

export function stringDsl(validator?: ValueDsl): StringDsl {
  return {
    type: 'string',
    dsl: validator,
  }
}

export function numberDsl(validator?: ValueDsl): NumberDsl {
  return {
    type: 'number',
    dsl: validator,
  }
}

export function booleanDsl(validator?: ValueDsl): BooleanDsl {
  return {
    type: 'boolean',
    dsl: validator,
  }
}

export function enumDsl(values: any[]): EnumDsl {
  return {
    type: 'enum',
    values,
  }
}

export function literalDsl(value: any): LiteralDsl {
  return {
    type: 'literal',
    value,
  }
}
