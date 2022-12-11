import { Schema } from '@oats-ts/validators'
import {
  ArrayDescriptor,
  BooleanDescriptor,
  EnumDescriptor,
  LiteralDescriptor,
  NumberDescriptor,
  ObjectDescriptor,
  Location,
  Style,
  PrimitiveDescriptor,
  StringDescriptor,
  ValueDescriptor,
  PropertyDescriptors,
  OptionalDescriptor,
  SchemaDescriptor,
  UnionDescriptor,
  PrimitiveTypeDescriptor,
} from './types'

export const primitiveDescriptor =
  <P extends Location, S extends Style>(location: P, style: S, explode: boolean, required: boolean) =>
  (value: ValueDescriptor): PrimitiveDescriptor<P, S> => ({
    type: 'primitive',
    explode,
    required,
    location,
    style,
    value,
  })

export const arrayDescriptor =
  <P extends Location, S extends Style>(location: P, style: S, explode: boolean, required: boolean) =>
  (items: ValueDescriptor): ArrayDescriptor<P, S> => ({
    type: 'array',
    explode,
    required,
    location,
    style,
    items,
  })

export const objectDescriptor =
  <P extends Location, S extends Style>(location: P, style: S, explode: boolean, required: boolean) =>
  (properties: PropertyDescriptors): ObjectDescriptor<P, S> => ({
    type: 'object',
    explode,
    required,
    location,
    style,
    properties,
  })

export const schemaDescriptor =
  <P extends Location>(location: P, required: boolean) =>
  (mimeType: string, schema: Schema): SchemaDescriptor<P> => ({
    type: 'schema',
    required,
    location,
    schema,
    mimeType,
  })

export function optionalDescriptor(value: ValueDescriptor): OptionalDescriptor {
  return {
    type: 'optional',
    value,
  }
}

export function stringDescriptor(value?: ValueDescriptor): StringDescriptor {
  return {
    type: 'string',
    value,
  }
}

export function numberDescriptor(value?: ValueDescriptor): NumberDescriptor {
  return {
    type: 'number',
    value,
  }
}

export function booleanDescriptor(value?: ValueDescriptor): BooleanDescriptor {
  return {
    type: 'boolean',
    value,
  }
}

export function enumDescriptor(values: any[]): EnumDescriptor {
  return {
    type: 'enum',
    values,
  }
}

export function literalDescriptor(value: any): LiteralDescriptor {
  return {
    type: 'literal',
    value,
  }
}

export function unionDescriptor(values: PrimitiveTypeDescriptor[]): UnionDescriptor {
  return {
    type: 'union',
    values,
  }
}
