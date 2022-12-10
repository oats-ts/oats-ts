import {
  CookieParameters,
  HeaderParameters,
  PathParameters,
  QueryParameters,
} from '../../generated/content-parameters/types'
import { CommonEnumType, CommonObjectType, CommonOptObjectType } from '../../generated/content-parameters/types'
import { random } from '../common/random'

const enumValues: CommonEnumType[] = ['A', 'B', 'C']

function commonObject(): CommonObjectType {
  return {
    objBoolField: random.boolean(),
    objEnmField: random.arrayElement(enumValues),
    objNumField: random.number(),
    objStrField: random.string(),
    objOptBoolField: random.optional(() => random.boolean()),
    objOptEnmField: random.optional(() => random.arrayElement(enumValues)),
    objOptNumField: random.optional(() => random.number()),
    objOptStrField: random.optional(() => random.string()),
  }
}

function optCommonObject(): CommonOptObjectType {
  return {
    optObjBoolField: random.boolean(),
    optObjEnmField: random.arrayElement(enumValues),
    optObjNumField: random.number(),
    optObjStrField: random.string(),
    optObjOptBoolField: random.optional(() => random.boolean()),
    optObjOptEnmField: random.optional(() => random.arrayElement(enumValues)),
    optObjOptNumField: random.optional(() => random.number()),
    optObjOptStrField: random.optional(() => random.string()),
  }
}

export function randomPathParameters(): PathParameters {
  return {
    str: random.string(),
    strArr: random.arrayOf(() => random.string()),

    num: random.number(),
    numArr: random.arrayOf(() => random.number()),

    bool: random.boolean(),
    boolArr: random.arrayOf(() => random.boolean()),

    enm: random.arrayElement(enumValues),
    enmArr: random.arrayOf(() => random.arrayElement(enumValues)),

    obj: commonObject(),
  }
}

export function randomQueryAndCookieParameters(): QueryParameters | CookieParameters {
  return {
    str: random.string(),
    strArr: random.arrayOf(() => random.string()),
    optStr: random.optional(() => random.string()),
    optStrArr: random.optional(() => random.arrayOf(() => random.string())),

    num: random.number(),
    numArr: random.arrayOf(() => random.number()),
    optNum: random.optional(() => random.number()),
    optNumArr: random.optional(() => random.arrayOf(() => random.number())),

    bool: random.boolean(),
    boolArr: random.arrayOf(() => random.boolean()),
    optBool: random.optional(() => random.boolean()),
    optBoolArr: random.optional(() => random.arrayOf(() => random.boolean())),

    enm: random.arrayElement(enumValues),
    enmArr: random.arrayOf(() => random.arrayElement(enumValues)),
    optEnm: random.optional(() => random.arrayElement(enumValues)),
    optEnmArr: random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),

    obj: commonObject(),
    optObj: random.optional(optCommonObject),
  }
}

export function randomHeaderParameters(): HeaderParameters {
  return {
    'X-Str-Header': random.string(),
    'X-StrArr-Header': random.arrayOf(() => random.string()),
    'X-OptStr-Header': random.optional(() => random.string()),
    'X-OptStrArr-Header': random.optional(() => random.arrayOf(() => random.string())),

    'X-Num-Header': random.number(),
    'X-NumArr-Header': random.arrayOf(() => random.number()),
    'X-OptNum-Header': random.optional(() => random.number()),
    'X-OptNumArr-Header': random.optional(() => random.arrayOf(() => random.number())),

    'X-Bool-Header': random.boolean(),
    'X-BoolArr-Header': random.arrayOf(() => random.boolean()),
    'X-OptBool-Header': random.optional(() => random.boolean()),
    'X-OptBoolArr-Header': random.optional(() => random.arrayOf(() => random.boolean())),

    'X-Enm-Header': random.arrayElement(enumValues),
    'X-EnmArr-Header': random.arrayOf(() => random.arrayElement(enumValues)),
    'X-OptEnm-Header': random.optional(() => random.arrayElement(enumValues)),
    'X-OptEnmArr-Header': random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),

    'X-Obj-Header': commonObject(),
    'X-OptObj-Header': random.optional(optCommonObject),
  }
}
