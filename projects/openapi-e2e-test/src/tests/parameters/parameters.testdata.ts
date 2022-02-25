import { datatype, random } from 'faker'
import {
  CommonEnumType,
  CommonObjectType,
  CommonObjectTypeExpl,
  CommonOptObjectType,
  CommonOptObjectTypeExpl,
  DeepObjectQueryParameters,
  FormQueryParameters,
  LabelPathParameters,
  MatrixPathParameters,
  PipeDelimitedQueryParameters,
  SimpleHeaderParameters,
  SimplePathParameters,
  SpaceDelimitedQueryParameters,
} from '../../generated/parameters'
import { arrayOf, optional } from '../common/testData'

const enumValues: CommonEnumType[] = ['A', 'B', 'C']

function commonObject(): CommonObjectType {
  return {
    objBoolField: datatype.boolean(),
    objEnmField: random.arrayElement(enumValues),
    objNumField: datatype.number(),
    objStrField: datatype.string(datatype.number({ min: 1, max: 10 })),
    objOptBoolField: optional(() => datatype.boolean()),
    objOptEnmField: optional(() => random.arrayElement(enumValues)),
    objOptNumField: optional(() => datatype.number()),
    objOptStrField: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
  }
}

function commonExplObject(): CommonObjectTypeExpl {
  return {
    objExplBoolField: datatype.boolean(),
    objExplEnmField: random.arrayElement(enumValues),
    objExplNumField: datatype.number(),
    objExplStrField: datatype.string(datatype.number({ min: 1, max: 10 })),
    objExplOptBoolField: optional(() => datatype.boolean()),
    objExplOptEnmField: optional(() => random.arrayElement(enumValues)),
    objExplOptNumField: optional(() => datatype.number()),
    objExplOptStrField: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
  }
}

function optCommonObject(): CommonOptObjectType {
  return {
    optObjBoolField: datatype.boolean(),
    optObjEnmField: random.arrayElement(enumValues),
    optObjNumField: datatype.number(),
    optObjStrField: datatype.string(datatype.number({ min: 1, max: 10 })),
    optObjOptBoolField: optional(() => datatype.boolean()),
    optObjOptEnmField: optional(() => random.arrayElement(enumValues)),
    optObjOptNumField: optional(() => datatype.number()),
    optObjOptStrField: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
  }
}

function optCommonExplObject(): CommonOptObjectTypeExpl {
  return {
    optObjExplBoolField: datatype.boolean(),
    optObjExplEnmField: random.arrayElement(enumValues),
    optObjExplNumField: datatype.number(),
    optObjExplStrField: datatype.string(datatype.number({ min: 1, max: 10 })),
    optObjExplOptBoolField: optional(() => datatype.boolean()),
    optObjExplOptEnmField: optional(() => random.arrayElement(enumValues)),
    optObjExplOptNumField: optional(() => datatype.number()),
    optObjExplOptStrField: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
  }
}

export function randomPathParameters(): SimplePathParameters & MatrixPathParameters & LabelPathParameters {
  return {
    str: datatype.string(datatype.number({ min: 2, max: 10 })),
    strExpl: datatype.string(datatype.number({ min: 2, max: 10 })),
    strArr: arrayOf(() => datatype.string(datatype.number({ min: 2, max: 10 }))),
    strArrExpl: arrayOf(() => datatype.string(datatype.number({ min: 2, max: 10 }))),

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

    obj: commonObject(),
    objExpl: commonExplObject(),
  }
}

export function randomFormQueryParameters(): FormQueryParameters {
  return {
    str: datatype.string(datatype.number({ min: 1, max: 10 })),
    strExpl: datatype.string(datatype.number({ min: 1, max: 10 })),
    strArr: arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    strArrExpl: arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    optStr: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    optStrExpl: optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    optStrArr: optional(() => arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 })))),
    optStrArrExpl: optional(() => arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 })))),

    num: datatype.number(),
    numExpl: datatype.number(),
    numArr: arrayOf(() => datatype.number()),
    numArrExpl: arrayOf(() => datatype.number()),
    optNum: optional(() => datatype.number()),
    optNumExpl: optional(() => datatype.number()),
    optNumArr: optional(() => arrayOf(() => datatype.number())),
    optNumArrExpl: optional(() => arrayOf(() => datatype.number())),

    bool: datatype.boolean(),
    boolExpl: datatype.boolean(),
    boolArr: arrayOf(() => datatype.boolean()),
    boolArrExpl: arrayOf(() => datatype.boolean()),
    optBool: optional(() => datatype.boolean()),
    optBoolExpl: optional(() => datatype.boolean()),
    optBoolArr: optional(() => arrayOf(() => datatype.boolean())),
    optBoolArrExpl: optional(() => arrayOf(() => datatype.boolean())),

    enm: random.arrayElement(enumValues),
    enmExpl: random.arrayElement(enumValues),
    enmArr: arrayOf(() => random.arrayElement(enumValues)),
    enmArrExpl: arrayOf(() => random.arrayElement(enumValues)),
    optEnm: optional(() => random.arrayElement(enumValues)),
    optEnmExpl: optional(() => random.arrayElement(enumValues)),
    optEnmArr: optional(() => arrayOf(() => random.arrayElement(enumValues))),
    optEnmArrExpl: optional(() => arrayOf(() => random.arrayElement(enumValues))),

    obj: commonObject(),
    objExpl: commonExplObject(),
    optObj: optional(optCommonObject),
    optObjExpl: optional(optCommonExplObject),
  }
}

export function randomDelimitedQueryParameters(): SpaceDelimitedQueryParameters & PipeDelimitedQueryParameters {
  return {
    strArrExpl: arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    boolArrExpl: arrayOf(() => datatype.boolean()),
    numArrExpl: arrayOf(() => datatype.number()),
    enmArrExpl: arrayOf(() => random.arrayElement(enumValues)),
    optStrArrExpl: optional(() => arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 })))),
    optNumArrExpl: optional(() => arrayOf(() => datatype.number())),
    optBoolArrExpl: optional(() => arrayOf(() => datatype.boolean())),
    optEnmArrExpl: optional(() => arrayOf(() => random.arrayElement(enumValues))),
  }
}

export function randomDeepObjectQueryParameters(): DeepObjectQueryParameters {
  return {
    objExpl: commonExplObject(),
    optObjExpl: optional(optCommonExplObject),
  }
}

export function randomHeaderParameters(): SimpleHeaderParameters {
  return {
    'X-Str-Header': datatype.string(datatype.number({ min: 1, max: 10 })),
    'X-StrExpl-Header': datatype.string(datatype.number({ min: 1, max: 10 })),
    'X-StrArr-Header': arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    'X-StrArrExpl-Header': arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    'X-OptStr-Header': optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    'X-OptStrExpl-Header': optional(() => datatype.string(datatype.number({ min: 1, max: 10 }))),
    'X-OptStrArr-Header': optional(() => arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 })))),
    'X-OptStrArrExpl-Header': optional(() => arrayOf(() => datatype.string(datatype.number({ min: 1, max: 10 })))),

    'X-Num-Header': datatype.number(),
    'X-NumExpl-Header': datatype.number(),
    'X-NumArr-Header': arrayOf(() => datatype.number()),
    'X-NumArrExpl-Header': arrayOf(() => datatype.number()),
    'X-OptNum-Header': optional(() => datatype.number()),
    'X-OptNumExpl-Header': optional(() => datatype.number()),
    'X-OptNumArr-Header': optional(() => arrayOf(() => datatype.number())),
    'X-OptNumArrExpl-Header': optional(() => arrayOf(() => datatype.number())),

    'X-Bool-Header': datatype.boolean(),
    'X-BoolExpl-Header': datatype.boolean(),
    'X-BoolArr-Header': arrayOf(() => datatype.boolean()),
    'X-BoolArrExpl-Header': arrayOf(() => datatype.boolean()),
    'X-OptBool-Header': optional(() => datatype.boolean()),
    'X-OptBoolExpl-Header': optional(() => datatype.boolean()),
    'X-OptBoolArr-Header': optional(() => arrayOf(() => datatype.boolean())),
    'X-OptBoolArrExpl-Header': optional(() => arrayOf(() => datatype.boolean())),

    'X-Enm-Header': random.arrayElement(enumValues),
    'X-EnmExpl-Header': random.arrayElement(enumValues),
    'X-EnmArr-Header': arrayOf(() => random.arrayElement(enumValues)),
    'X-EnmArrExpl-Header': arrayOf(() => random.arrayElement(enumValues)),
    'X-OptEnm-Header': optional(() => random.arrayElement(enumValues)),
    'X-OptEnmExpl-Header': optional(() => random.arrayElement(enumValues)),
    'X-OptEnmArr-Header': optional(() => arrayOf(() => random.arrayElement(enumValues))),
    'X-OptEnmArrExpl-Header': optional(() => arrayOf(() => random.arrayElement(enumValues))),

    'X-Obj-Header': commonObject(),
    'X-ObjExpl-Header': commonExplObject(),
    'X-OptObj-Header': optional(optCommonObject),
    'X-OptObjExpl-Header': optional(optCommonExplObject),
  }
}
