/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/parameters.json (originating from oats-ts/oats-schemas)
 */

import { parameter as _parameter } from '@oats-ts/openapi-runtime'

export const simpleResponseHeaderParametersResponseHeaderParameters = {
  200: {
    descriptor: {
      'X-StrExpl-Header': _parameter.header.simple.exploded.required.primitive(_parameter.value.string()),
      'X-OptStrExpl-Header': _parameter.header.simple.exploded.primitive(_parameter.value.string()),
      'X-Str-Header': _parameter.header.simple.required.primitive(_parameter.value.string()),
      'X-OptStr-Header': _parameter.header.simple.primitive(_parameter.value.string()),
      'X-NumExpl-Header': _parameter.header.simple.exploded.required.primitive(_parameter.value.number()),
      'X-OptNumExpl-Header': _parameter.header.simple.exploded.primitive(_parameter.value.number()),
      'X-Num-Header': _parameter.header.simple.required.primitive(_parameter.value.number()),
      'X-OptNum-Header': _parameter.header.simple.primitive(_parameter.value.number()),
      'X-BoolExpl-Header': _parameter.header.simple.exploded.required.primitive(_parameter.value.boolean()),
      'X-OptBoolExpl-Header': _parameter.header.simple.exploded.primitive(_parameter.value.boolean()),
      'X-Bool-Header': _parameter.header.simple.required.primitive(_parameter.value.boolean()),
      'X-OptBool-Header': _parameter.header.simple.primitive(_parameter.value.boolean()),
      'X-EnmExpl-Header': _parameter.header.simple.exploded.required.primitive(_parameter.value.string()),
      'X-OptEnmExpl-Header': _parameter.header.simple.exploded.primitive(_parameter.value.string()),
      'X-Enm-Header': _parameter.header.simple.required.primitive(_parameter.value.string()),
      'X-OptEnm-Header': _parameter.header.simple.primitive(_parameter.value.string()),
      'X-StrArrExpl-Header': _parameter.header.simple.exploded.required.array(_parameter.value.string()),
      'X-OptStrArrExpl-Header': _parameter.header.simple.exploded.array(_parameter.value.string()),
      'X-StrArr-Header': _parameter.header.simple.required.array(_parameter.value.string()),
      'X-OptStrArr-Header': _parameter.header.simple.array(_parameter.value.string()),
      'X-NumArrExpl-Header': _parameter.header.simple.exploded.required.array(_parameter.value.number()),
      'X-OptNumArrExpl-Header': _parameter.header.simple.exploded.array(_parameter.value.number()),
      'X-NumArr-Header': _parameter.header.simple.required.array(_parameter.value.number()),
      'X-OptNumArr-Header': _parameter.header.simple.array(_parameter.value.number()),
      'X-BoolArrExpl-Header': _parameter.header.simple.exploded.required.array(_parameter.value.boolean()),
      'X-OptBoolArrExpl-Header': _parameter.header.simple.exploded.array(_parameter.value.boolean()),
      'X-BoolArr-Header': _parameter.header.simple.required.array(_parameter.value.boolean()),
      'X-OptBoolArr-Header': _parameter.header.simple.array(_parameter.value.boolean()),
      'X-EnmArrExpl-Header': _parameter.header.simple.exploded.required.array(_parameter.value.string()),
      'X-OptEnmArrExpl-Header': _parameter.header.simple.exploded.array(_parameter.value.string()),
      'X-EnmArr-Header': _parameter.header.simple.required.array(_parameter.value.string()),
      'X-OptEnmArr-Header': _parameter.header.simple.array(_parameter.value.string()),
      'X-ObjExpl-Header': _parameter.header.simple.exploded.required.object({
        objExplStrField: _parameter.value.string(),
        objExplNumField: _parameter.value.number(),
        objExplBoolField: _parameter.value.boolean(),
        objExplEnmField: _parameter.value.string(),
        objExplOptStrField: _parameter.value.optional(_parameter.value.string()),
        objExplOptNumField: _parameter.value.optional(_parameter.value.number()),
        objExplOptBoolField: _parameter.value.optional(_parameter.value.boolean()),
        objExplOptEnmField: _parameter.value.optional(_parameter.value.string()),
      }),
      'X-OptObjExpl-Header': _parameter.header.simple.exploded.object({
        optObjExplStrField: _parameter.value.string(),
        optObjExplNumField: _parameter.value.number(),
        optObjExplBoolField: _parameter.value.boolean(),
        optObjExplEnmField: _parameter.value.string(),
        optObjExplOptStrField: _parameter.value.optional(_parameter.value.string()),
        optObjExplOptNumField: _parameter.value.optional(_parameter.value.number()),
        optObjExplOptBoolField: _parameter.value.optional(_parameter.value.boolean()),
        optObjExplOptEnmField: _parameter.value.optional(_parameter.value.string()),
      }),
      'X-Obj-Header': _parameter.header.simple.required.object({
        objStrField: _parameter.value.string(),
        objNumField: _parameter.value.number(),
        objBoolField: _parameter.value.boolean(),
        objEnmField: _parameter.value.string(),
        objOptStrField: _parameter.value.optional(_parameter.value.string()),
        objOptNumField: _parameter.value.optional(_parameter.value.number()),
        objOptBoolField: _parameter.value.optional(_parameter.value.boolean()),
        objOptEnmField: _parameter.value.optional(_parameter.value.string()),
      }),
      'X-OptObj-Header': _parameter.header.simple.object({
        optObjStrField: _parameter.value.string(),
        optObjNumField: _parameter.value.number(),
        optObjBoolField: _parameter.value.boolean(),
        optObjEnmField: _parameter.value.string(),
        optObjOptStrField: _parameter.value.optional(_parameter.value.string()),
        optObjOptNumField: _parameter.value.optional(_parameter.value.number()),
        optObjOptBoolField: _parameter.value.optional(_parameter.value.boolean()),
        optObjOptEnmField: _parameter.value.optional(_parameter.value.string()),
      }),
    },
  },
} as const
