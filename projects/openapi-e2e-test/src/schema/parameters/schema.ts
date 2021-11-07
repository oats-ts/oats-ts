import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getFieldName, referenceOf } from './schemaUtils'

export const components: Record<string, () => SchemaObject> = {
  CommonEnumType: () => _enumSchema,
  ParameterIssue: () => _parameterIssueSchema,
  CommonObjectType: () => _objectSchema,
  CommonObjectTypeExpl: () => _objectSchemaExpl,
  CommonOptObjectType: () => _optObjectSchema,
  CommonOptObjectTypeExpl: () => _optObjectSchemaExpl,
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

function createObjectSchema(prefix: string): SchemaObject {
  return {
    type: 'object',
    required: [
      getFieldName(stringSchema, false, true, prefix),
      getFieldName(numberSchema, false, true, prefix),
      getFieldName(booleanSchema, false, true, prefix),
      getFieldName(_enumSchema, false, true, prefix),
    ],
    properties: {
      // Required
      [getFieldName(stringSchema, false, true, prefix)]: stringSchema,
      [getFieldName(numberSchema, false, true, prefix)]: numberSchema,
      [getFieldName(booleanSchema, false, true, prefix)]: booleanSchema,
      [getFieldName(_enumSchema, false, true, prefix)]: referenceOf(_enumSchema),
      // Optional
      [getFieldName(stringSchema, true, true, prefix)]: stringSchema,
      [getFieldName(numberSchema, true, true, prefix)]: numberSchema,
      [getFieldName(booleanSchema, true, true, prefix)]: booleanSchema,
      [getFieldName(_enumSchema, true, true, prefix)]: referenceOf(_enumSchema),
    },
  }
}

export const _objectSchema = createObjectSchema('obj')
export const _objectSchemaExpl = createObjectSchema('objExpl')
export const _optObjectSchema = createObjectSchema('optObj')
export const _optObjectSchemaExpl = createObjectSchema('optObjExpl')

export const objectSchema = referenceOf(_objectSchema)
export const objectSchemaExpl = referenceOf(_objectSchemaExpl)
export const optObjectSchema = referenceOf(_optObjectSchema)
export const optObjectSchemaExpl = referenceOf(_optObjectSchemaExpl)

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
