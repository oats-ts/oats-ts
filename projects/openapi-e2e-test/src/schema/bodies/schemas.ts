import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { arraySchema, booleanSchema, enumSchema, numberSchema, referenceOf, stringSchema } from '../common/schema'

export const registry = {
  EnumType: () => enumSchema,
  ObjectWithArrays: () => objectWithArrays,
  ObjectWithPrimitives: () => objectWithPrimitives,
  ObjectWithNestedObjects: () => objectWithNestedObjects,
}

const objectWithPrimitives: SchemaObject = {
  type: 'object',
  required: ['str', 'num', 'enm', 'bool'],
  properties: {
    str: stringSchema,
    num: numberSchema,
    enm: referenceOf(enumSchema, registry),
    bool: booleanSchema,
  },
}

const objectWithArrays: SchemaObject = {
  type: 'object',
  required: ['strArr', 'numArr', 'enmArr', 'boolArr'],
  properties: {
    strArr: arraySchema(stringSchema),
    numArr: arraySchema(numberSchema),
    enmArr: arraySchema(referenceOf(enumSchema, registry)),
    boolArr: arraySchema(booleanSchema),
  },
}

const objectWithNestedObjects: SchemaObject = {
  type: 'object',
  required: ['primObj', 'arrObj'],
  properties: {
    primObj: referenceOf(objectWithPrimitives, registry),
    arrObj: referenceOf(objectWithArrays, registry),
  },
}

export const schemas: Record<string, Referenceable<SchemaObject>> = {
  str: stringSchema,
  num: numberSchema,
  enm: referenceOf(enumSchema, registry),
  bool: booleanSchema,
  'str-arr': arraySchema(stringSchema),
  'num-arr': arraySchema(numberSchema),
  'enm-arr': arraySchema(referenceOf(enumSchema, registry)),
  'bool-arr': arraySchema(booleanSchema),
  'prim-obj': referenceOf(objectWithPrimitives, registry),
  'arr-obj': referenceOf(objectWithArrays, registry),
  'nested-obj': referenceOf(objectWithNestedObjects, registry),
}
