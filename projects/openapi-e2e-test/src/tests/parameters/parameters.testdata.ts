import { datatype, random } from 'faker'
import {
  CommonEnumType,
  LabelPathParameters,
  MatrixPathParameters,
  SimplePathParameters,
} from '../../generated/Parameters'

const enumValues: CommonEnumType[] = ['A', 'B', 'C']

function arrayOf<T>(producer: () => T): T[] {
  return datatype.array(datatype.number({ min: 1, max: 10 })).map(producer)
}

function optional<T>(producer: () => T): T | undefined {
  return datatype.boolean() ? producer() : undefined
}

export function randomPathParameters(): SimplePathParameters & MatrixPathParameters & LabelPathParameters {
  return {
    str: datatype.string(datatype.number({ min: 1, max: 10 })),
    strExpl: datatype.string(datatype.number({ min: 1, max: 10 })),
    strArr: arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    strArrExpl: arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),

    num: datatype.number(),
    numExpl: datatype.number(),
    numArr: arrayOf(() => datatype.number()),
    numArrExpl: arrayOf(() => datatype.number()),

    bool: datatype.boolean(),
    boolExpl: datatype.boolean(),
    boolArr: arrayOf(() => datatype.boolean()),
    boolArrExpl: arrayOf(() => datatype.boolean()),

    enm: random.arrayElement(enumValues),
    enmExpl: random.arrayElement(enumValues),
    enmArr: arrayOf(() => random.arrayElement(enumValues)),
    enmArrExpl: arrayOf(() => random.arrayElement(enumValues)),

    obj: {
      bool: datatype.boolean(),
      enm: random.arrayElement(enumValues),
      num: datatype.number(),
      str: datatype.string(datatype.number({ min: 1, max: 10 })),
      optBool: optional(() => datatype.boolean()),
      optEnm: optional(() => random.arrayElement(enumValues)),
      optNum: optional(() => datatype.number()),
      optStr: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    },

    objExpl: {
      bool: datatype.boolean(),
      enm: random.arrayElement(enumValues),
      num: datatype.number(),
      str: datatype.string(datatype.number({ min: 1, max: 10 })),
      optBool: optional(() => datatype.boolean()),
      optEnm: optional(() => random.arrayElement(enumValues)),
      optNum: optional(() => datatype.number()),
      optStr: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    },
  }
}
