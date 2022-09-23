import { FormCookieParametersCookieParameters } from '../../generated/parameters/cookieTypes'
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
} from '../../generated/parameters/types'
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

function commonExplObject(): CommonObjectTypeExpl {
  return {
    objExplBoolField: random.boolean(),
    objExplEnmField: random.arrayElement(enumValues),
    objExplNumField: random.number(),
    objExplStrField: random.string(),
    objExplOptBoolField: random.optional(() => random.boolean()),
    objExplOptEnmField: random.optional(() => random.arrayElement(enumValues)),
    objExplOptNumField: random.optional(() => random.number()),
    objExplOptStrField: random.optional(() => random.string()),
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

function optCommonExplObject(): CommonOptObjectTypeExpl {
  return {
    optObjExplBoolField: random.boolean(),
    optObjExplEnmField: random.arrayElement(enumValues),
    optObjExplNumField: random.number(),
    optObjExplStrField: random.string(),
    optObjExplOptBoolField: random.optional(() => random.boolean()),
    optObjExplOptEnmField: random.optional(() => random.arrayElement(enumValues)),
    optObjExplOptNumField: random.optional(() => random.number()),
    optObjExplOptStrField: random.optional(() => random.string()),
  }
}

export function randomPathParameters(): SimplePathParameters & MatrixPathParameters & LabelPathParameters {
  return {
    str: random.string(),
    strExpl: random.string(),
    strArr: random.arrayOf(() => random.string()),
    strArrExpl: random.arrayOf(() => random.string()),

    num: random.number(),
    numExpl: random.number(),
    numArr: random.arrayOf(() => random.number()),
    numArrExpl: random.arrayOf(() => random.number()),

    bool: random.boolean(),
    boolExpl: random.boolean(),
    boolArr: random.arrayOf(() => random.boolean()),
    boolArrExpl: random.arrayOf(() => random.boolean()),

    enm: random.arrayElement(enumValues),
    enmExpl: random.arrayElement(enumValues),
    enmArr: random.arrayOf(() => random.arrayElement(enumValues)),
    enmArrExpl: random.arrayOf(() => random.arrayElement(enumValues)),

    obj: commonObject(),
    objExpl: commonExplObject(),
  }
}

export function randomFormQueryParameters(): FormQueryParameters {
  return {
    str: random.string(),
    strExpl: random.string(),
    strArr: random.arrayOf(() => random.string()),
    strArrExpl: random.arrayOf(() => random.string()),
    optStr: random.optional(() => random.string()),
    optStrExpl: random.optional(() => random.string()),
    optStrArr: random.optional(() => random.arrayOf(() => random.string())),
    optStrArrExpl: random.optional(() => random.arrayOf(() => random.string())),

    num: random.number(),
    numExpl: random.number(),
    numArr: random.arrayOf(() => random.number()),
    numArrExpl: random.arrayOf(() => random.number()),
    optNum: random.optional(() => random.number()),
    optNumExpl: random.optional(() => random.number()),
    optNumArr: random.optional(() => random.arrayOf(() => random.number())),
    optNumArrExpl: random.optional(() => random.arrayOf(() => random.number())),

    bool: random.boolean(),
    boolExpl: random.boolean(),
    boolArr: random.arrayOf(() => random.boolean()),
    boolArrExpl: random.arrayOf(() => random.boolean()),
    optBool: random.optional(() => random.boolean()),
    optBoolExpl: random.optional(() => random.boolean()),
    optBoolArr: random.optional(() => random.arrayOf(() => random.boolean())),
    optBoolArrExpl: random.optional(() => random.arrayOf(() => random.boolean())),

    enm: random.arrayElement(enumValues),
    enmExpl: random.arrayElement(enumValues),
    enmArr: random.arrayOf(() => random.arrayElement(enumValues)),
    enmArrExpl: random.arrayOf(() => random.arrayElement(enumValues)),
    optEnm: random.optional(() => random.arrayElement(enumValues)),
    optEnmExpl: random.optional(() => random.arrayElement(enumValues)),
    optEnmArr: random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),
    optEnmArrExpl: random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),

    obj: commonObject(),
    objExpl: commonExplObject(),
    optObj: random.optional(optCommonObject),
    optObjExpl: random.optional(optCommonExplObject),
  }
}

export function randomDelimitedQueryParameters(): SpaceDelimitedQueryParameters & PipeDelimitedQueryParameters {
  return {
    strArrExpl: random.arrayOf(() => random.string()),
    boolArrExpl: random.arrayOf(() => random.boolean()),
    numArrExpl: random.arrayOf(() => random.number()),
    enmArrExpl: random.arrayOf(() => random.arrayElement(enumValues)),
    optStrArrExpl: random.optional(() => random.arrayOf(() => random.string())),
    optNumArrExpl: random.optional(() => random.arrayOf(() => random.number())),
    optBoolArrExpl: random.optional(() => random.arrayOf(() => random.boolean())),
    optEnmArrExpl: random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),
  }
}

export function randomDeepObjectQueryParameters(): DeepObjectQueryParameters {
  return {
    objExpl: commonExplObject(),
    optObjExpl: random.optional(optCommonExplObject),
  }
}

export function randomHeaderParameters(): SimpleHeaderParameters {
  return {
    'X-Str-Header': random.string(),
    'X-StrExpl-Header': random.string(),
    'X-StrArr-Header': random.arrayOf(() => random.string()),
    'X-StrArrExpl-Header': random.arrayOf(() => random.string()),
    'X-OptStr-Header': random.optional(() => random.string()),
    'X-OptStrExpl-Header': random.optional(() => random.string()),
    'X-OptStrArr-Header': random.optional(() => random.arrayOf(() => random.string())),
    'X-OptStrArrExpl-Header': random.optional(() => random.arrayOf(() => random.string())),

    'X-Num-Header': random.number(),
    'X-NumExpl-Header': random.number(),
    'X-NumArr-Header': random.arrayOf(() => random.number()),
    'X-NumArrExpl-Header': random.arrayOf(() => random.number()),
    'X-OptNum-Header': random.optional(() => random.number()),
    'X-OptNumExpl-Header': random.optional(() => random.number()),
    'X-OptNumArr-Header': random.optional(() => random.arrayOf(() => random.number())),
    'X-OptNumArrExpl-Header': random.optional(() => random.arrayOf(() => random.number())),

    'X-Bool-Header': random.boolean(),
    'X-BoolExpl-Header': random.boolean(),
    'X-BoolArr-Header': random.arrayOf(() => random.boolean()),
    'X-BoolArrExpl-Header': random.arrayOf(() => random.boolean()),
    'X-OptBool-Header': random.optional(() => random.boolean()),
    'X-OptBoolExpl-Header': random.optional(() => random.boolean()),
    'X-OptBoolArr-Header': random.optional(() => random.arrayOf(() => random.boolean())),
    'X-OptBoolArrExpl-Header': random.optional(() => random.arrayOf(() => random.boolean())),

    'X-Enm-Header': random.arrayElement(enumValues),
    'X-EnmExpl-Header': random.arrayElement(enumValues),
    'X-EnmArr-Header': random.arrayOf(() => random.arrayElement(enumValues)),
    'X-EnmArrExpl-Header': random.arrayOf(() => random.arrayElement(enumValues)),
    'X-OptEnm-Header': random.optional(() => random.arrayElement(enumValues)),
    'X-OptEnmExpl-Header': random.optional(() => random.arrayElement(enumValues)),
    'X-OptEnmArr-Header': random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),
    'X-OptEnmArrExpl-Header': random.optional(() => random.arrayOf(() => random.arrayElement(enumValues))),

    'X-Obj-Header': commonObject(),
    'X-ObjExpl-Header': commonExplObject(),
    'X-OptObj-Header': random.optional(optCommonObject),
    'X-OptObjExpl-Header': random.optional(optCommonExplObject),
  }
}

export function randomCookieParameters(): FormCookieParametersCookieParameters {
  return {
    optStr: random.optional(() => random.string()),
    optNum: random.optional(() => random.number()),
    optBool: random.optional(() => random.boolean()),
    optEnm: random.optional(() => random.arrayElement(enumValues)),
  }
}
