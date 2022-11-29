import {
  ArrayDsl,
  BooleanDsl,
  EnumDsl,
  LiteralDsl,
  NumberDsl,
  ObjectDsl,
  DslLocation,
  DslStyle,
  PrimitiveDsl,
  StringDsl,
  ValueDsl,
  PropertiesDsl,
  OptionalDsl,
} from './types'

export const primitiveDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, explode: boolean, required: boolean) =>
  (value: ValueDsl): PrimitiveDsl<P, S> => ({
    type: 'primitive',
    explode,
    required,
    location,
    style,
    value,
  })

export const arrayDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, explode: boolean, required: boolean) =>
  (items: ValueDsl): ArrayDsl<P, S> => ({
    type: 'array',
    explode,
    required,
    location,
    style,
    items,
  })

export const objectDsl =
  <P extends DslLocation, S extends DslStyle>(location: P, style: S, explode: boolean, required: boolean) =>
  (properties: PropertiesDsl): ObjectDsl<P, S> => ({
    type: 'object',
    explode,
    required,
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
