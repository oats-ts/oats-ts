import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/json-schema-common'
import { entries, flatMap, isNil, last } from 'lodash'
import { SchemaType } from './typings'
import _camelCase from 'camelcase'

export const components: Record<string, () => SchemaObject> = {
  CommonEnumType: () => _enumSchema,
  CommonObjectType: () => _objectSchema,
  ParameterIssue: () => _parameterIssueSchema,
}

export const numberSchema: SchemaObject = {
  type: 'number',
}

export const stringSchema: SchemaObject = {
  type: 'string',
}

export const booleanSchema: SchemaObject = {
  type: 'boolean',
}

const _enumSchema: SchemaObject = {
  type: 'string',
  enum: ['A', 'B', 'C'],
}

export const enumSchema: ReferenceObject = referenceOf(_enumSchema)

export const _objectSchema: SchemaObject = {
  type: 'object',
  required: [
    getFieldName(stringSchema, false),
    getFieldName(numberSchema, false),
    getFieldName(booleanSchema, false),
    getFieldName(_enumSchema, false),
  ],
  properties: {
    // Required
    [getFieldName(stringSchema, false)]: stringSchema,
    [getFieldName(numberSchema, false)]: numberSchema,
    [getFieldName(booleanSchema, false)]: booleanSchema,
    [getFieldName(_enumSchema, false)]: referenceOf(_enumSchema),
    // Optional
    [getFieldName(stringSchema, true)]: stringSchema,
    [getFieldName(numberSchema, true)]: numberSchema,
    [getFieldName(booleanSchema, true)]: booleanSchema,
    [getFieldName(_enumSchema, true)]: referenceOf(_enumSchema),
  },
}

export const objectSchema = referenceOf(_objectSchema)

export const stringArraySchema = arraySchema(stringSchema)
export const numberArraySchema = arraySchema(numberSchema)
export const booleanArraySchema = arraySchema(booleanSchema)
export const enumArraySchema = arraySchema(referenceOf(_enumSchema))

export const _parameterIssueSchema: SchemaObject = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' },
  },
}

export const parameterIssueSchema: ReferenceObject = referenceOf(_parameterIssueSchema)

function arraySchema(items: Referenceable<SchemaObject>): SchemaObject {
  return {
    type: 'array',
    items,
  }
}

function referenceOf(schema: SchemaObject): ReferenceObject {
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
