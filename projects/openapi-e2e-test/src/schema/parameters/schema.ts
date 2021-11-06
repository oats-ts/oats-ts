import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getFieldName, referenceOf } from './schemaUtils'

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
