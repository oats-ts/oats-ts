import { datatype, random } from 'faker'
import { EnumType, ObjectWithArrays, ObjectWithNestedObjects, ObjectWithPrimitives } from '../../generated/Bodies'
import { arrayOf } from '../common/testData'

const enumValues: EnumType[] = ['A', 'B', 'C']

export function randomEnum(): EnumType {
  return random.arrayElement(enumValues)
}

export function randomObjectWithPrimitives(): ObjectWithPrimitives {
  return {
    str: datatype.string(datatype.number({ min: 1, max: 10 })),
    num: datatype.number(),
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
