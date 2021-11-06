import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/json-schema-common'
import { entries, flatMap, isNil, last } from 'lodash'
import { SchemaType } from './typings'
import _camelCase from 'camelcase'
import {
  booleanArraySchema,
  booleanSchema,
  components,
  enumArraySchema,
  enumSchema,
  numberArraySchema,
  numberSchema,
  objectSchema,
  stringArraySchema,
  stringSchema,
} from './schema'

export function referenceOf(schema: SchemaObject): ReferenceObject {
  for (const [name, provider] of entries(components)) {
    if (provider() === schema) {
      return { $ref: `#/components/schemas/${name}` }
    }
  }
  throw new TypeError(`Non-referenceable schema ${schema}`)
}

export function camelCase(...inputs: string[]): string {
  return _camelCase(inputs.filter((e) => !isNil(e) && e.length > 0).join('-'))
}

export function getFieldName(schema: Referenceable<SchemaObject>, optional: boolean): string {
  if (isReferenceObject(schema)) {
    const { $ref } = schema
    const name = last($ref.split('/')) as string
    const provider = components[name]
    if (isNil(provider)) {
      throw new TypeError(`Invalid reference ${$ref}`)
    }
    return getFieldName(provider(), optional)
  }
  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return camelCase(optional ? 'opt' : '', 'enm')
      }
      return camelCase(optional ? 'opt' : '', 'str')
    case 'number':
      return camelCase(optional ? 'opt' : '', 'num')
    case 'boolean':
      return camelCase(optional ? 'opt' : '', 'bool')
    case 'array':
      return camelCase(optional ? 'opt' : '', getFieldName(schema.items as Referenceable<SchemaObject>, false), 'arr')
    case 'object':
      return camelCase(optional ? 'opt' : '', 'obj')
    default:
      throw new TypeError(`Invalid input ${JSON.stringify(schema)}`)
  }
}

export function getSchemas(types: SchemaType[]): Referenceable<SchemaObject>[] {
  return flatMap(types, (type) => {
    switch (type) {
      case 'primitive':
        return [stringSchema, numberSchema, booleanSchema, enumSchema]
      case 'array':
        return [stringArraySchema, numberArraySchema, booleanArraySchema, enumArraySchema]
      case 'object':
        return [objectSchema]
    }
  })
}
