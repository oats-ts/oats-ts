import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import {
  arraySchema,
  booleanSchema,
  enumSchema,
  literalSchema,
  numberSchema,
  referenceOf,
  stringSchema,
  tupleSchema,
} from '../common/schema'

export const registry = {
  EnumType: () => enumSchema,
  PrimitiveTupleType: () => primitiveTupe,
  PrimitiveOptionalTupleType: () => optionalPrimitiveTuple,
  ObjectWithArrays: () => objectWithArrays,
  ObjectWithPrimitives: () => objectWithPrimitives,
  ObjectWithNestedObjects: () => objectWithNestedObjects,
}

const primitiveTupe = tupleSchema(
  5,
  literalSchema,
  stringSchema,
  numberSchema,
  referenceOf(enumSchema, registry),
  booleanSchema,
)

const optionalPrimitiveTuple = tupleSchema(
  0,
  literalSchema,
  stringSchema,
  numberSchema,
  referenceOf(enumSchema, registry),
  booleanSchema,
)

const objectWithPrimitives: SchemaObject = {
  type: 'object',
  required: ['str', 'num', 'enm', 'bool', 'lit'],
  properties: {
    lit: literalSchema,
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
  'prim-tuple': referenceOf(primitiveTupe, registry),
  'opt-prim-tuple': referenceOf(optionalPrimitiveTuple, registry),
  'str-arr': arraySchema(stringSchema),
  'num-arr': arraySchema(numberSchema),
  'enm-arr': arraySchema(referenceOf(enumSchema, registry)),
  'bool-arr': arraySchema(booleanSchema),
  'prim-obj': referenceOf(objectWithPrimitives, registry),
  'arr-obj': referenceOf(objectWithArrays, registry),
  'nested-obj': referenceOf(objectWithNestedObjects, registry),
}
