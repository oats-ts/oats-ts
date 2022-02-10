import { datatype, random } from 'faker'
import {
  EnumType,
  ObjectWithArrays,
  ObjectWithNestedObjects,
  ObjectWithPrimitives,
  PrimitiveOptionalTupleType,
  PrimitiveTupleType,
} from '../../generated/Bodies'
import { arrayOf } from '../common/testData'

const enumValues: EnumType[] = ['A', 'B', 'C']

export function randomEnum(): EnumType {
  return random.arrayElement(enumValues)
}

export function randomObjectWithPrimitives(): ObjectWithPrimitives {
  return {
    str: datatype.string(datatype.number({ min: 1, max: 10 })),
    num: datatype.number(),
    lit: 'Literal Value',
    bool: datatype.boolean(),
    enm: randomEnum(),
  }
}

export function randomObjectWithArrays(): ObjectWithArrays {
  return {
    strArr: arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    numArr: arrayOf(() => datatype.number()),
    boolArr: arrayOf(() => datatype.boolean()),
    enmArr: arrayOf(randomEnum),
  }
}

export function randomObjectWithNestedObjects(): ObjectWithNestedObjects {
  return {
    arrObj: randomObjectWithArrays(),
    primObj: randomObjectWithPrimitives(),
  }
}

export function randomTuple(): PrimitiveTupleType {
  return ['Literal Value', datatype.string(), datatype.number(), randomEnum(), datatype.boolean()]
}

export function randomOptionalTuple(): PrimitiveOptionalTupleType {
  return randomTuple().slice(0, datatype.number({ min: 0, max: 5 })) as PrimitiveOptionalTupleType
}
