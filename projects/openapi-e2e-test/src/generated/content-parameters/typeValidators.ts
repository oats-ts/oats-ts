/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/content-parameters.json (originating from oats-ts/oats-schemas)
 */

import { validators } from '@oats-ts/openapi-runtime'

export const commonEnumTypeTypeValidator = validators.union({
  A: validators.literal('A'),
  B: validators.literal('B'),
  C: validators.literal('C'),
})

export const commonObjectTypeExplTypeValidator = validators.object(
  validators.shape({
    objExplBoolField: validators.boolean(),
    objExplEnmField: validators.lazy(() => commonEnumTypeTypeValidator),
    objExplNumField: validators.number(),
    objExplOptBoolField: validators.optional(validators.boolean()),
    objExplOptEnmField: validators.optional(validators.lazy(() => commonEnumTypeTypeValidator)),
    objExplOptNumField: validators.optional(validators.number()),
    objExplOptStrField: validators.optional(validators.string()),
    objExplStrField: validators.string(),
  }),
)

export const commonObjectTypeTypeValidator = validators.object(
  validators.shape({
    objBoolField: validators.boolean(),
    objEnmField: validators.lazy(() => commonEnumTypeTypeValidator),
    objNumField: validators.number(),
    objOptBoolField: validators.optional(validators.boolean()),
    objOptEnmField: validators.optional(validators.lazy(() => commonEnumTypeTypeValidator)),
    objOptNumField: validators.optional(validators.number()),
    objOptStrField: validators.optional(validators.string()),
    objStrField: validators.string(),
  }),
)

export const commonOptObjectTypeTypeValidator = validators.object(
  validators.shape({
    optObjBoolField: validators.boolean(),
    optObjEnmField: validators.lazy(() => commonEnumTypeTypeValidator),
    optObjNumField: validators.number(),
    optObjOptBoolField: validators.optional(validators.boolean()),
    optObjOptEnmField: validators.optional(validators.lazy(() => commonEnumTypeTypeValidator)),
    optObjOptNumField: validators.optional(validators.number()),
    optObjOptStrField: validators.optional(validators.string()),
    optObjStrField: validators.string(),
  }),
)

export const cookieParametersTypeValidator = validators.object(
  validators.shape({
    bool: validators.boolean(),
    boolArr: validators.array(validators.items(validators.boolean())),
    enm: validators.lazy(() => commonEnumTypeTypeValidator),
    enmArr: validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    num: validators.number(),
    numArr: validators.array(validators.items(validators.number())),
    obj: validators.lazy(() => commonObjectTypeTypeValidator),
    optBool: validators.optional(validators.boolean()),
    optBoolArr: validators.optional(validators.array(validators.items(validators.boolean()))),
    optEnm: validators.optional(validators.lazy(() => commonEnumTypeTypeValidator)),
    optEnmArr: validators.optional(
      validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    ),
    optNum: validators.optional(validators.number()),
    optNumArr: validators.optional(validators.array(validators.items(validators.number()))),
    optObj: validators.optional(validators.lazy(() => commonOptObjectTypeTypeValidator)),
    optStr: validators.optional(validators.string()),
    optStrArr: validators.optional(validators.array(validators.items(validators.string()))),
    str: validators.string(),
    strArr: validators.array(validators.items(validators.string())),
  }),
)

export const headerParametersTypeValidator = validators.object(
  validators.shape({
    'X-Bool-Header': validators.boolean(),
    'X-BoolArr-Header': validators.array(validators.items(validators.boolean())),
    'X-Enm-Header': validators.lazy(() => commonEnumTypeTypeValidator),
    'X-EnmArr-Header': validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    'X-Num-Header': validators.number(),
    'X-NumArr-Header': validators.array(validators.items(validators.number())),
    'X-Obj-Header': validators.lazy(() => commonObjectTypeTypeValidator),
    'X-OptBool-Header': validators.optional(validators.boolean()),
    'X-OptBoolArr-Header': validators.optional(validators.array(validators.items(validators.boolean()))),
    'X-OptEnm-Header': validators.optional(validators.lazy(() => commonEnumTypeTypeValidator)),
    'X-OptEnmArr-Header': validators.optional(
      validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    ),
    'X-OptNum-Header': validators.optional(validators.number()),
    'X-OptNumArr-Header': validators.optional(validators.array(validators.items(validators.number()))),
    'X-OptObj-Header': validators.optional(validators.lazy(() => commonOptObjectTypeTypeValidator)),
    'X-OptStr-Header': validators.optional(validators.string()),
    'X-OptStrArr-Header': validators.optional(validators.array(validators.items(validators.string()))),
    'X-Str-Header': validators.string(),
    'X-StrArr-Header': validators.array(validators.items(validators.string())),
  }),
)

export const parameterIssueTypeValidator = validators.object(validators.shape({ message: validators.string() }))

export const pathParametersTypeValidator = validators.object(
  validators.shape({
    bool: validators.boolean(),
    boolArr: validators.array(validators.items(validators.boolean())),
    enm: validators.lazy(() => commonEnumTypeTypeValidator),
    enmArr: validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    num: validators.number(),
    numArr: validators.array(validators.items(validators.number())),
    obj: validators.lazy(() => commonObjectTypeTypeValidator),
    str: validators.string(),
    strArr: validators.array(validators.items(validators.string())),
  }),
)

export const queryParametersTypeValidator = validators.object(
  validators.shape({
    bool: validators.boolean(),
    boolArr: validators.array(validators.items(validators.boolean())),
    enm: validators.lazy(() => commonEnumTypeTypeValidator),
    enmArr: validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    num: validators.number(),
    numArr: validators.array(validators.items(validators.number())),
    obj: validators.lazy(() => commonObjectTypeTypeValidator),
    optBool: validators.optional(validators.boolean()),
    optBoolArr: validators.optional(validators.array(validators.items(validators.boolean()))),
    optEnm: validators.optional(validators.lazy(() => commonEnumTypeTypeValidator)),
    optEnmArr: validators.optional(
      validators.array(validators.items(validators.lazy(() => commonEnumTypeTypeValidator))),
    ),
    optNum: validators.optional(validators.number()),
    optNumArr: validators.optional(validators.array(validators.items(validators.number()))),
    optObj: validators.optional(validators.lazy(() => commonOptObjectTypeTypeValidator)),
    optStr: validators.optional(validators.string()),
    optStrArr: validators.optional(validators.array(validators.items(validators.string()))),
    str: validators.string(),
    strArr: validators.array(validators.items(validators.string())),
  }),
)
