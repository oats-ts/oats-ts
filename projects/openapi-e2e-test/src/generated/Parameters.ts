import {
  ClientConfiguration,
  HasHeaders,
  HasIssues,
  HasNoIssues,
  HasPathParameters,
  HasQueryParameters,
  HttpResponse,
  RawHttpResponse,
} from '@oats-ts/openapi-http'
import { execute } from '@oats-ts/openapi-http-client'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import {
  createHeaderDeserializer,
  createPathDeserializer,
  createQueryDeserializer,
  deserializers,
} from '@oats-ts/openapi-parameter-deserialization'
import {
  createHeaderSerializer,
  createPathSerializer,
  createQuerySerializer,
  joinUrl,
  serializers,
} from '@oats-ts/openapi-parameter-serialization'
import { array, boolean, enumeration, items, lazy, number, object, optional, shape, string } from '@oats-ts/validators'
import { NextFunction, Request, Response, Router } from 'express'

export type CommonEnumType = 'A' | 'B' | 'C'

export type CommonObjectType = {
  bool: boolean
  enm: CommonEnumType
  num: number
  optBool?: boolean
  optEnm?: CommonEnumType
  optNum?: number
  optStr?: string
  str: string
}

export type DeepObjectQueryParameters = {
  objExpl: CommonObjectType
  optObjExpl?: CommonObjectType
}

export type FormQueryParameters = {
  bool: boolean
  boolArr: boolean[]
  boolArrExpl: boolean[]
  boolExpl: boolean
  enm: CommonEnumType
  enmArr: CommonEnumType[]
  enmArrExpl: CommonEnumType[]
  enmExpl: CommonEnumType
  num: number
  numArr: number[]
  numArrExpl: number[]
  numExpl: number
  obj: CommonObjectType
  objExpl: CommonObjectType
  optBool?: boolean
  optBoolArr?: boolean[]
  optBoolArrExpl?: boolean[]
  optBoolExpl?: boolean
  optEnm?: CommonEnumType
  optEnmArr?: CommonEnumType[]
  optEnmArrExpl?: CommonEnumType[]
  optEnmExpl?: CommonEnumType
  optNum?: number
  optNumArr?: number[]
  optNumArrExpl?: number[]
  optNumExpl?: number
  optObj?: CommonObjectType
  optObjExpl?: CommonObjectType
  optStr?: string
  optStrArr?: string[]
  optStrArrExpl?: string[]
  optStrExpl?: string
  str: string
  strArr: string[]
  strArrExpl: string[]
  strExpl: string
}

export type LabelPathParameters = {
  bool: boolean
  boolArr: boolean[]
  boolArrExpl: boolean[]
  boolExpl: boolean
  enm: CommonEnumType
  enmArr: CommonEnumType[]
  enmArrExpl: CommonEnumType[]
  enmExpl: CommonEnumType
  num: number
  numArr: number[]
  numArrExpl: number[]
  numExpl: number
  obj: CommonObjectType
  objExpl: CommonObjectType
  str: string
  strArr: string[]
  strArrExpl: string[]
  strExpl: string
}

export type MatrixPathParameters = {
  bool: boolean
  boolArr: boolean[]
  boolArrExpl: boolean[]
  boolExpl: boolean
  enm: CommonEnumType
  enmArr: CommonEnumType[]
  enmArrExpl: CommonEnumType[]
  enmExpl: CommonEnumType
  num: number
  numArr: number[]
  numArrExpl: number[]
  numExpl: number
  obj: CommonObjectType
  objExpl: CommonObjectType
  str: string
  strArr: string[]
  strArrExpl: string[]
  strExpl: string
}

export type ParameterIssue = {
  message: string
}

export type PipeDelimitedQueryParameters = {
  boolArrExpl: boolean[]
  enmArrExpl: CommonEnumType[]
  numArrExpl: number[]
  optBoolArrExpl?: boolean[]
  optEnmArrExpl?: CommonEnumType[]
  optNumArrExpl?: number[]
  optStrArrExpl?: string[]
  strArrExpl: string[]
}

export type SimpleHeaderParameters = {
  'X-Bool-Header': boolean
  'X-BoolArr-Header': boolean[]
  'X-BoolArrExpl-Header': boolean[]
  'X-BoolExpl-Header': boolean
  'X-Enm-Header': CommonEnumType
  'X-EnmArr-Header': CommonEnumType[]
  'X-EnmArrExpl-Header': CommonEnumType[]
  'X-EnmExpl-Header': CommonEnumType
  'X-Num-Header': number
  'X-NumArr-Header': number[]
  'X-NumArrExpl-Header': number[]
  'X-NumExpl-Header': number
  'X-Obj-Header': CommonObjectType
  'X-ObjExpl-Header': CommonObjectType
  'X-OptBool-Header'?: boolean
  'X-OptBoolArr-Header'?: boolean[]
  'X-OptBoolArrExpl-Header'?: boolean[]
  'X-OptBoolExpl-Header'?: boolean
  'X-OptEnm-Header'?: CommonEnumType
  'X-OptEnmArr-Header'?: CommonEnumType[]
  'X-OptEnmArrExpl-Header'?: CommonEnumType[]
  'X-OptEnmExpl-Header'?: CommonEnumType
  'X-OptNum-Header'?: number
  'X-OptNumArr-Header'?: number[]
  'X-OptNumArrExpl-Header'?: number[]
  'X-OptNumExpl-Header'?: number
  'X-OptObj-Header'?: CommonObjectType
  'X-OptObjExpl-Header'?: CommonObjectType
  'X-OptStr-Header'?: string
  'X-OptStrArr-Header'?: string[]
  'X-OptStrArrExpl-Header'?: string[]
  'X-OptStrExpl-Header'?: string
  'X-Str-Header': string
  'X-StrArr-Header': string[]
  'X-StrArrExpl-Header': string[]
  'X-StrExpl-Header': string
}

export type SimplePathParameters = {
  bool: boolean
  boolArr: boolean[]
  boolArrExpl: boolean[]
  boolExpl: boolean
  enm: CommonEnumType
  enmArr: CommonEnumType[]
  enmArrExpl: CommonEnumType[]
  enmExpl: CommonEnumType
  num: number
  numArr: number[]
  numArrExpl: number[]
  numExpl: number
  obj: CommonObjectType
  objExpl: CommonObjectType
  str: string
  strArr: string[]
  strArrExpl: string[]
  strExpl: string
}

export type SpaceDelimitedQueryParameters = {
  boolArrExpl: boolean[]
  enmArrExpl: CommonEnumType[]
  numArrExpl: number[]
  optBoolArrExpl?: boolean[]
  optEnmArrExpl?: CommonEnumType[]
  optNumArrExpl?: number[]
  optStrArrExpl?: string[]
  strArrExpl: string[]
}

export const commonEnumTypeTypeValidator = enumeration(['A', 'B', 'C'])

export const commonObjectTypeTypeValidator = object(
  shape({
    bool: boolean(),
    enm: lazy(() => commonEnumTypeTypeValidator),
    num: number(),
    optBool: optional(boolean()),
    optEnm: optional(lazy(() => commonEnumTypeTypeValidator)),
    optNum: optional(number()),
    optStr: optional(string()),
    str: string(),
  }),
)

export const deepObjectQueryParametersTypeValidator = object(
  shape({
    objExpl: lazy(() => commonObjectTypeTypeValidator),
    optObjExpl: optional(lazy(() => commonObjectTypeTypeValidator)),
  }),
)

export const formQueryParametersTypeValidator = object(
  shape({
    bool: boolean(),
    boolArr: array(items(boolean())),
    boolArrExpl: array(items(boolean())),
    boolExpl: boolean(),
    enm: lazy(() => commonEnumTypeTypeValidator),
    enmArr: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmArrExpl: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmExpl: lazy(() => commonEnumTypeTypeValidator),
    num: number(),
    numArr: array(items(number())),
    numArrExpl: array(items(number())),
    numExpl: number(),
    obj: lazy(() => commonObjectTypeTypeValidator),
    objExpl: lazy(() => commonObjectTypeTypeValidator),
    optBool: optional(boolean()),
    optBoolArr: optional(array(items(boolean()))),
    optBoolArrExpl: optional(array(items(boolean()))),
    optBoolExpl: optional(boolean()),
    optEnm: optional(lazy(() => commonEnumTypeTypeValidator)),
    optEnmArr: optional(array(items(lazy(() => commonEnumTypeTypeValidator)))),
    optEnmArrExpl: optional(array(items(lazy(() => commonEnumTypeTypeValidator)))),
    optEnmExpl: optional(lazy(() => commonEnumTypeTypeValidator)),
    optNum: optional(number()),
    optNumArr: optional(array(items(number()))),
    optNumArrExpl: optional(array(items(number()))),
    optNumExpl: optional(number()),
    optObj: optional(lazy(() => commonObjectTypeTypeValidator)),
    optObjExpl: optional(lazy(() => commonObjectTypeTypeValidator)),
    optStr: optional(string()),
    optStrArr: optional(array(items(string()))),
    optStrArrExpl: optional(array(items(string()))),
    optStrExpl: optional(string()),
    str: string(),
    strArr: array(items(string())),
    strArrExpl: array(items(string())),
    strExpl: string(),
  }),
)

export const labelPathParametersTypeValidator = object(
  shape({
    bool: boolean(),
    boolArr: array(items(boolean())),
    boolArrExpl: array(items(boolean())),
    boolExpl: boolean(),
    enm: lazy(() => commonEnumTypeTypeValidator),
    enmArr: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmArrExpl: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmExpl: lazy(() => commonEnumTypeTypeValidator),
    num: number(),
    numArr: array(items(number())),
    numArrExpl: array(items(number())),
    numExpl: number(),
    obj: lazy(() => commonObjectTypeTypeValidator),
    objExpl: lazy(() => commonObjectTypeTypeValidator),
    str: string(),
    strArr: array(items(string())),
    strArrExpl: array(items(string())),
    strExpl: string(),
  }),
)

export const matrixPathParametersTypeValidator = object(
  shape({
    bool: boolean(),
    boolArr: array(items(boolean())),
    boolArrExpl: array(items(boolean())),
    boolExpl: boolean(),
    enm: lazy(() => commonEnumTypeTypeValidator),
    enmArr: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmArrExpl: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmExpl: lazy(() => commonEnumTypeTypeValidator),
    num: number(),
    numArr: array(items(number())),
    numArrExpl: array(items(number())),
    numExpl: number(),
    obj: lazy(() => commonObjectTypeTypeValidator),
    objExpl: lazy(() => commonObjectTypeTypeValidator),
    str: string(),
    strArr: array(items(string())),
    strArrExpl: array(items(string())),
    strExpl: string(),
  }),
)

export const parameterIssueTypeValidator = object(shape({ message: string() }))

export const pipeDelimitedQueryParametersTypeValidator = object(
  shape({
    boolArrExpl: array(items(boolean())),
    enmArrExpl: array(items(lazy(() => commonEnumTypeTypeValidator))),
    numArrExpl: array(items(number())),
    optBoolArrExpl: optional(array(items(boolean()))),
    optEnmArrExpl: optional(array(items(lazy(() => commonEnumTypeTypeValidator)))),
    optNumArrExpl: optional(array(items(number()))),
    optStrArrExpl: optional(array(items(string()))),
    strArrExpl: array(items(string())),
  }),
)

export const simpleHeaderParametersTypeValidator = object(
  shape({
    'X-Bool-Header': boolean(),
    'X-BoolArr-Header': array(items(boolean())),
    'X-BoolArrExpl-Header': array(items(boolean())),
    'X-BoolExpl-Header': boolean(),
    'X-Enm-Header': lazy(() => commonEnumTypeTypeValidator),
    'X-EnmArr-Header': array(items(lazy(() => commonEnumTypeTypeValidator))),
    'X-EnmArrExpl-Header': array(items(lazy(() => commonEnumTypeTypeValidator))),
    'X-EnmExpl-Header': lazy(() => commonEnumTypeTypeValidator),
    'X-Num-Header': number(),
    'X-NumArr-Header': array(items(number())),
    'X-NumArrExpl-Header': array(items(number())),
    'X-NumExpl-Header': number(),
    'X-Obj-Header': lazy(() => commonObjectTypeTypeValidator),
    'X-ObjExpl-Header': lazy(() => commonObjectTypeTypeValidator),
    'X-OptBool-Header': optional(boolean()),
    'X-OptBoolArr-Header': optional(array(items(boolean()))),
    'X-OptBoolArrExpl-Header': optional(array(items(boolean()))),
    'X-OptBoolExpl-Header': optional(boolean()),
    'X-OptEnm-Header': optional(lazy(() => commonEnumTypeTypeValidator)),
    'X-OptEnmArr-Header': optional(array(items(lazy(() => commonEnumTypeTypeValidator)))),
    'X-OptEnmArrExpl-Header': optional(array(items(lazy(() => commonEnumTypeTypeValidator)))),
    'X-OptEnmExpl-Header': optional(lazy(() => commonEnumTypeTypeValidator)),
    'X-OptNum-Header': optional(number()),
    'X-OptNumArr-Header': optional(array(items(number()))),
    'X-OptNumArrExpl-Header': optional(array(items(number()))),
    'X-OptNumExpl-Header': optional(number()),
    'X-OptObj-Header': optional(lazy(() => commonObjectTypeTypeValidator)),
    'X-OptObjExpl-Header': optional(lazy(() => commonObjectTypeTypeValidator)),
    'X-OptStr-Header': optional(string()),
    'X-OptStrArr-Header': optional(array(items(string()))),
    'X-OptStrArrExpl-Header': optional(array(items(string()))),
    'X-OptStrExpl-Header': optional(string()),
    'X-Str-Header': string(),
    'X-StrArr-Header': array(items(string())),
    'X-StrArrExpl-Header': array(items(string())),
    'X-StrExpl-Header': string(),
  }),
)

export const simplePathParametersTypeValidator = object(
  shape({
    bool: boolean(),
    boolArr: array(items(boolean())),
    boolArrExpl: array(items(boolean())),
    boolExpl: boolean(),
    enm: lazy(() => commonEnumTypeTypeValidator),
    enmArr: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmArrExpl: array(items(lazy(() => commonEnumTypeTypeValidator))),
    enmExpl: lazy(() => commonEnumTypeTypeValidator),
    num: number(),
    numArr: array(items(number())),
    numArrExpl: array(items(number())),
    numExpl: number(),
    obj: lazy(() => commonObjectTypeTypeValidator),
    objExpl: lazy(() => commonObjectTypeTypeValidator),
    str: string(),
    strArr: array(items(string())),
    strArrExpl: array(items(string())),
    strExpl: string(),
  }),
)

export const spaceDelimitedQueryParametersTypeValidator = object(
  shape({
    boolArrExpl: array(items(boolean())),
    enmArrExpl: array(items(lazy(() => commonEnumTypeTypeValidator))),
    numArrExpl: array(items(number())),
    optBoolArrExpl: optional(array(items(boolean()))),
    optEnmArrExpl: optional(array(items(lazy(() => commonEnumTypeTypeValidator)))),
    optNumArrExpl: optional(array(items(number()))),
    optStrArrExpl: optional(array(items(string()))),
    strArrExpl: array(items(string())),
  }),
)

export function isCommonEnumType(input: any): input is CommonEnumType {
  return input === 'A' || input === 'B' || input === 'C'
}

export function isCommonObjectType(input: any): input is CommonObjectType {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.bool === 'boolean' &&
    isCommonEnumType(input.enm) &&
    typeof input.num === 'number' &&
    (input.optBool === null || input.optBool === undefined || typeof input.optBool === 'boolean') &&
    (input.optEnm === null || input.optEnm === undefined || isCommonEnumType(input.optEnm)) &&
    (input.optNum === null || input.optNum === undefined || typeof input.optNum === 'number') &&
    (input.optStr === null || input.optStr === undefined || typeof input.optStr === 'string') &&
    typeof input.str === 'string'
  )
}

export function isDeepObjectQueryParameters(input: any): input is DeepObjectQueryParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    isCommonObjectType(input.objExpl) &&
    (input.optObjExpl === null || input.optObjExpl === undefined || isCommonObjectType(input.optObjExpl))
  )
}

export function isFormQueryParameters(input: any): input is FormQueryParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.bool === 'boolean' &&
    Array.isArray(input.boolArr) &&
    input.boolArr.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.boolArrExpl) &&
    input.boolArrExpl.every((item: any) => typeof item === 'boolean') &&
    typeof input.boolExpl === 'boolean' &&
    isCommonEnumType(input.enm) &&
    Array.isArray(input.enmArr) &&
    input.enmArr.every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input.enmArrExpl) &&
    input.enmArrExpl.every((item: any) => isCommonEnumType(item)) &&
    isCommonEnumType(input.enmExpl) &&
    typeof input.num === 'number' &&
    Array.isArray(input.numArr) &&
    input.numArr.every((item: any) => typeof item === 'number') &&
    Array.isArray(input.numArrExpl) &&
    input.numArrExpl.every((item: any) => typeof item === 'number') &&
    typeof input.numExpl === 'number' &&
    isCommonObjectType(input.obj) &&
    isCommonObjectType(input.objExpl) &&
    (input.optBool === null || input.optBool === undefined || typeof input.optBool === 'boolean') &&
    (input.optBoolArr === null ||
      input.optBoolArr === undefined ||
      (Array.isArray(input.optBoolArr) && input.optBoolArr.every((item: any) => typeof item === 'boolean'))) &&
    (input.optBoolArrExpl === null ||
      input.optBoolArrExpl === undefined ||
      (Array.isArray(input.optBoolArrExpl) && input.optBoolArrExpl.every((item: any) => typeof item === 'boolean'))) &&
    (input.optBoolExpl === null || input.optBoolExpl === undefined || typeof input.optBoolExpl === 'boolean') &&
    (input.optEnm === null || input.optEnm === undefined || isCommonEnumType(input.optEnm)) &&
    (input.optEnmArr === null ||
      input.optEnmArr === undefined ||
      (Array.isArray(input.optEnmArr) && input.optEnmArr.every((item: any) => isCommonEnumType(item)))) &&
    (input.optEnmArrExpl === null ||
      input.optEnmArrExpl === undefined ||
      (Array.isArray(input.optEnmArrExpl) && input.optEnmArrExpl.every((item: any) => isCommonEnumType(item)))) &&
    (input.optEnmExpl === null || input.optEnmExpl === undefined || isCommonEnumType(input.optEnmExpl)) &&
    (input.optNum === null || input.optNum === undefined || typeof input.optNum === 'number') &&
    (input.optNumArr === null ||
      input.optNumArr === undefined ||
      (Array.isArray(input.optNumArr) && input.optNumArr.every((item: any) => typeof item === 'number'))) &&
    (input.optNumArrExpl === null ||
      input.optNumArrExpl === undefined ||
      (Array.isArray(input.optNumArrExpl) && input.optNumArrExpl.every((item: any) => typeof item === 'number'))) &&
    (input.optNumExpl === null || input.optNumExpl === undefined || typeof input.optNumExpl === 'number') &&
    (input.optObj === null || input.optObj === undefined || isCommonObjectType(input.optObj)) &&
    (input.optObjExpl === null || input.optObjExpl === undefined || isCommonObjectType(input.optObjExpl)) &&
    (input.optStr === null || input.optStr === undefined || typeof input.optStr === 'string') &&
    (input.optStrArr === null ||
      input.optStrArr === undefined ||
      (Array.isArray(input.optStrArr) && input.optStrArr.every((item: any) => typeof item === 'string'))) &&
    (input.optStrArrExpl === null ||
      input.optStrArrExpl === undefined ||
      (Array.isArray(input.optStrArrExpl) && input.optStrArrExpl.every((item: any) => typeof item === 'string'))) &&
    (input.optStrExpl === null || input.optStrExpl === undefined || typeof input.optStrExpl === 'string') &&
    typeof input.str === 'string' &&
    Array.isArray(input.strArr) &&
    input.strArr.every((item: any) => typeof item === 'string') &&
    Array.isArray(input.strArrExpl) &&
    input.strArrExpl.every((item: any) => typeof item === 'string') &&
    typeof input.strExpl === 'string'
  )
}

export function isLabelPathParameters(input: any): input is LabelPathParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.bool === 'boolean' &&
    Array.isArray(input.boolArr) &&
    input.boolArr.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.boolArrExpl) &&
    input.boolArrExpl.every((item: any) => typeof item === 'boolean') &&
    typeof input.boolExpl === 'boolean' &&
    isCommonEnumType(input.enm) &&
    Array.isArray(input.enmArr) &&
    input.enmArr.every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input.enmArrExpl) &&
    input.enmArrExpl.every((item: any) => isCommonEnumType(item)) &&
    isCommonEnumType(input.enmExpl) &&
    typeof input.num === 'number' &&
    Array.isArray(input.numArr) &&
    input.numArr.every((item: any) => typeof item === 'number') &&
    Array.isArray(input.numArrExpl) &&
    input.numArrExpl.every((item: any) => typeof item === 'number') &&
    typeof input.numExpl === 'number' &&
    isCommonObjectType(input.obj) &&
    isCommonObjectType(input.objExpl) &&
    typeof input.str === 'string' &&
    Array.isArray(input.strArr) &&
    input.strArr.every((item: any) => typeof item === 'string') &&
    Array.isArray(input.strArrExpl) &&
    input.strArrExpl.every((item: any) => typeof item === 'string') &&
    typeof input.strExpl === 'string'
  )
}

export function isMatrixPathParameters(input: any): input is MatrixPathParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.bool === 'boolean' &&
    Array.isArray(input.boolArr) &&
    input.boolArr.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.boolArrExpl) &&
    input.boolArrExpl.every((item: any) => typeof item === 'boolean') &&
    typeof input.boolExpl === 'boolean' &&
    isCommonEnumType(input.enm) &&
    Array.isArray(input.enmArr) &&
    input.enmArr.every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input.enmArrExpl) &&
    input.enmArrExpl.every((item: any) => isCommonEnumType(item)) &&
    isCommonEnumType(input.enmExpl) &&
    typeof input.num === 'number' &&
    Array.isArray(input.numArr) &&
    input.numArr.every((item: any) => typeof item === 'number') &&
    Array.isArray(input.numArrExpl) &&
    input.numArrExpl.every((item: any) => typeof item === 'number') &&
    typeof input.numExpl === 'number' &&
    isCommonObjectType(input.obj) &&
    isCommonObjectType(input.objExpl) &&
    typeof input.str === 'string' &&
    Array.isArray(input.strArr) &&
    input.strArr.every((item: any) => typeof item === 'string') &&
    Array.isArray(input.strArrExpl) &&
    input.strArrExpl.every((item: any) => typeof item === 'string') &&
    typeof input.strExpl === 'string'
  )
}

export function isParameterIssue(input: any): input is ParameterIssue {
  return input !== null && typeof input === 'object' && typeof input.message === 'string'
}

export function isPipeDelimitedQueryParameters(input: any): input is PipeDelimitedQueryParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.boolArrExpl) &&
    input.boolArrExpl.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.enmArrExpl) &&
    input.enmArrExpl.every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input.numArrExpl) &&
    input.numArrExpl.every((item: any) => typeof item === 'number') &&
    (input.optBoolArrExpl === null ||
      input.optBoolArrExpl === undefined ||
      (Array.isArray(input.optBoolArrExpl) && input.optBoolArrExpl.every((item: any) => typeof item === 'boolean'))) &&
    (input.optEnmArrExpl === null ||
      input.optEnmArrExpl === undefined ||
      (Array.isArray(input.optEnmArrExpl) && input.optEnmArrExpl.every((item: any) => isCommonEnumType(item)))) &&
    (input.optNumArrExpl === null ||
      input.optNumArrExpl === undefined ||
      (Array.isArray(input.optNumArrExpl) && input.optNumArrExpl.every((item: any) => typeof item === 'number'))) &&
    (input.optStrArrExpl === null ||
      input.optStrArrExpl === undefined ||
      (Array.isArray(input.optStrArrExpl) && input.optStrArrExpl.every((item: any) => typeof item === 'string'))) &&
    Array.isArray(input.strArrExpl) &&
    input.strArrExpl.every((item: any) => typeof item === 'string')
  )
}

export function isSimpleHeaderParameters(input: any): input is SimpleHeaderParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input['X-Bool-Header'] === 'boolean' &&
    Array.isArray(input['X-BoolArr-Header']) &&
    input['X-BoolArr-Header'].every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input['X-BoolArrExpl-Header']) &&
    input['X-BoolArrExpl-Header'].every((item: any) => typeof item === 'boolean') &&
    typeof input['X-BoolExpl-Header'] === 'boolean' &&
    isCommonEnumType(input['X-Enm-Header']) &&
    Array.isArray(input['X-EnmArr-Header']) &&
    input['X-EnmArr-Header'].every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input['X-EnmArrExpl-Header']) &&
    input['X-EnmArrExpl-Header'].every((item: any) => isCommonEnumType(item)) &&
    isCommonEnumType(input['X-EnmExpl-Header']) &&
    typeof input['X-Num-Header'] === 'number' &&
    Array.isArray(input['X-NumArr-Header']) &&
    input['X-NumArr-Header'].every((item: any) => typeof item === 'number') &&
    Array.isArray(input['X-NumArrExpl-Header']) &&
    input['X-NumArrExpl-Header'].every((item: any) => typeof item === 'number') &&
    typeof input['X-NumExpl-Header'] === 'number' &&
    isCommonObjectType(input['X-Obj-Header']) &&
    isCommonObjectType(input['X-ObjExpl-Header']) &&
    (input['X-OptBool-Header'] === null ||
      input['X-OptBool-Header'] === undefined ||
      typeof input['X-OptBool-Header'] === 'boolean') &&
    (input['X-OptBoolArr-Header'] === null ||
      input['X-OptBoolArr-Header'] === undefined ||
      (Array.isArray(input['X-OptBoolArr-Header']) &&
        input['X-OptBoolArr-Header'].every((item: any) => typeof item === 'boolean'))) &&
    (input['X-OptBoolArrExpl-Header'] === null ||
      input['X-OptBoolArrExpl-Header'] === undefined ||
      (Array.isArray(input['X-OptBoolArrExpl-Header']) &&
        input['X-OptBoolArrExpl-Header'].every((item: any) => typeof item === 'boolean'))) &&
    (input['X-OptBoolExpl-Header'] === null ||
      input['X-OptBoolExpl-Header'] === undefined ||
      typeof input['X-OptBoolExpl-Header'] === 'boolean') &&
    (input['X-OptEnm-Header'] === null ||
      input['X-OptEnm-Header'] === undefined ||
      isCommonEnumType(input['X-OptEnm-Header'])) &&
    (input['X-OptEnmArr-Header'] === null ||
      input['X-OptEnmArr-Header'] === undefined ||
      (Array.isArray(input['X-OptEnmArr-Header']) &&
        input['X-OptEnmArr-Header'].every((item: any) => isCommonEnumType(item)))) &&
    (input['X-OptEnmArrExpl-Header'] === null ||
      input['X-OptEnmArrExpl-Header'] === undefined ||
      (Array.isArray(input['X-OptEnmArrExpl-Header']) &&
        input['X-OptEnmArrExpl-Header'].every((item: any) => isCommonEnumType(item)))) &&
    (input['X-OptEnmExpl-Header'] === null ||
      input['X-OptEnmExpl-Header'] === undefined ||
      isCommonEnumType(input['X-OptEnmExpl-Header'])) &&
    (input['X-OptNum-Header'] === null ||
      input['X-OptNum-Header'] === undefined ||
      typeof input['X-OptNum-Header'] === 'number') &&
    (input['X-OptNumArr-Header'] === null ||
      input['X-OptNumArr-Header'] === undefined ||
      (Array.isArray(input['X-OptNumArr-Header']) &&
        input['X-OptNumArr-Header'].every((item: any) => typeof item === 'number'))) &&
    (input['X-OptNumArrExpl-Header'] === null ||
      input['X-OptNumArrExpl-Header'] === undefined ||
      (Array.isArray(input['X-OptNumArrExpl-Header']) &&
        input['X-OptNumArrExpl-Header'].every((item: any) => typeof item === 'number'))) &&
    (input['X-OptNumExpl-Header'] === null ||
      input['X-OptNumExpl-Header'] === undefined ||
      typeof input['X-OptNumExpl-Header'] === 'number') &&
    (input['X-OptObj-Header'] === null ||
      input['X-OptObj-Header'] === undefined ||
      isCommonObjectType(input['X-OptObj-Header'])) &&
    (input['X-OptObjExpl-Header'] === null ||
      input['X-OptObjExpl-Header'] === undefined ||
      isCommonObjectType(input['X-OptObjExpl-Header'])) &&
    (input['X-OptStr-Header'] === null ||
      input['X-OptStr-Header'] === undefined ||
      typeof input['X-OptStr-Header'] === 'string') &&
    (input['X-OptStrArr-Header'] === null ||
      input['X-OptStrArr-Header'] === undefined ||
      (Array.isArray(input['X-OptStrArr-Header']) &&
        input['X-OptStrArr-Header'].every((item: any) => typeof item === 'string'))) &&
    (input['X-OptStrArrExpl-Header'] === null ||
      input['X-OptStrArrExpl-Header'] === undefined ||
      (Array.isArray(input['X-OptStrArrExpl-Header']) &&
        input['X-OptStrArrExpl-Header'].every((item: any) => typeof item === 'string'))) &&
    (input['X-OptStrExpl-Header'] === null ||
      input['X-OptStrExpl-Header'] === undefined ||
      typeof input['X-OptStrExpl-Header'] === 'string') &&
    typeof input['X-Str-Header'] === 'string' &&
    Array.isArray(input['X-StrArr-Header']) &&
    input['X-StrArr-Header'].every((item: any) => typeof item === 'string') &&
    Array.isArray(input['X-StrArrExpl-Header']) &&
    input['X-StrArrExpl-Header'].every((item: any) => typeof item === 'string') &&
    typeof input['X-StrExpl-Header'] === 'string'
  )
}

export function isSimplePathParameters(input: any): input is SimplePathParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.bool === 'boolean' &&
    Array.isArray(input.boolArr) &&
    input.boolArr.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.boolArrExpl) &&
    input.boolArrExpl.every((item: any) => typeof item === 'boolean') &&
    typeof input.boolExpl === 'boolean' &&
    isCommonEnumType(input.enm) &&
    Array.isArray(input.enmArr) &&
    input.enmArr.every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input.enmArrExpl) &&
    input.enmArrExpl.every((item: any) => isCommonEnumType(item)) &&
    isCommonEnumType(input.enmExpl) &&
    typeof input.num === 'number' &&
    Array.isArray(input.numArr) &&
    input.numArr.every((item: any) => typeof item === 'number') &&
    Array.isArray(input.numArrExpl) &&
    input.numArrExpl.every((item: any) => typeof item === 'number') &&
    typeof input.numExpl === 'number' &&
    isCommonObjectType(input.obj) &&
    isCommonObjectType(input.objExpl) &&
    typeof input.str === 'string' &&
    Array.isArray(input.strArr) &&
    input.strArr.every((item: any) => typeof item === 'string') &&
    Array.isArray(input.strArrExpl) &&
    input.strArrExpl.every((item: any) => typeof item === 'string') &&
    typeof input.strExpl === 'string'
  )
}

export function isSpaceDelimitedQueryParameters(input: any): input is SpaceDelimitedQueryParameters {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.boolArrExpl) &&
    input.boolArrExpl.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.enmArrExpl) &&
    input.enmArrExpl.every((item: any) => isCommonEnumType(item)) &&
    Array.isArray(input.numArrExpl) &&
    input.numArrExpl.every((item: any) => typeof item === 'number') &&
    (input.optBoolArrExpl === null ||
      input.optBoolArrExpl === undefined ||
      (Array.isArray(input.optBoolArrExpl) && input.optBoolArrExpl.every((item: any) => typeof item === 'boolean'))) &&
    (input.optEnmArrExpl === null ||
      input.optEnmArrExpl === undefined ||
      (Array.isArray(input.optEnmArrExpl) && input.optEnmArrExpl.every((item: any) => isCommonEnumType(item)))) &&
    (input.optNumArrExpl === null ||
      input.optNumArrExpl === undefined ||
      (Array.isArray(input.optNumArrExpl) && input.optNumArrExpl.every((item: any) => typeof item === 'number'))) &&
    (input.optStrArrExpl === null ||
      input.optStrArrExpl === undefined ||
      (Array.isArray(input.optStrArrExpl) && input.optStrArrExpl.every((item: any) => typeof item === 'string'))) &&
    Array.isArray(input.strArrExpl) &&
    input.strArrExpl.every((item: any) => typeof item === 'string')
  )
}

export type DeepObjectQueryParametersQueryParameters = {
  objExpl: CommonObjectType
  optObjExpl?: CommonObjectType
}

export type FormQueryParametersQueryParameters = {
  strExpl: string
  optStrExpl?: string
  str: string
  optStr?: string
  numExpl: number
  optNumExpl?: number
  num: number
  optNum?: number
  boolExpl: boolean
  optBoolExpl?: boolean
  bool: boolean
  optBool?: boolean
  enmExpl: CommonEnumType
  optEnmExpl?: CommonEnumType
  enm: CommonEnumType
  optEnm?: CommonEnumType
  strArrExpl: string[]
  optStrArrExpl?: string[]
  strArr: string[]
  optStrArr?: string[]
  numArrExpl: number[]
  optNumArrExpl?: number[]
  numArr: number[]
  optNumArr?: number[]
  boolArrExpl: boolean[]
  optBoolArrExpl?: boolean[]
  boolArr: boolean[]
  optBoolArr?: boolean[]
  enmArrExpl: CommonEnumType[]
  optEnmArrExpl?: CommonEnumType[]
  enmArr: CommonEnumType[]
  optEnmArr?: CommonEnumType[]
  objExpl: CommonObjectType
  optObjExpl?: CommonObjectType
  obj: CommonObjectType
  optObj?: CommonObjectType
}

export type PipeDelimitedQueryParametersQueryParameters = {
  strArrExpl: string[]
  optStrArrExpl?: string[]
  numArrExpl: number[]
  optNumArrExpl?: number[]
  boolArrExpl: boolean[]
  optBoolArrExpl?: boolean[]
  enmArrExpl: CommonEnumType[]
  optEnmArrExpl?: CommonEnumType[]
}

export type SpaceDelimitedQueryParametersQueryParameters = {
  strArrExpl: string[]
  optStrArrExpl?: string[]
  numArrExpl: number[]
  optNumArrExpl?: number[]
  boolArrExpl: boolean[]
  optBoolArrExpl?: boolean[]
  enmArrExpl: CommonEnumType[]
  optEnmArrExpl?: CommonEnumType[]
}

export type LabelPathParametersPathParameters = {
  strExpl: string
  str: string
  numExpl: number
  num: number
  boolExpl: boolean
  bool: boolean
  enmExpl: CommonEnumType
  enm: CommonEnumType
  strArrExpl: string[]
  strArr: string[]
  numArrExpl: number[]
  numArr: number[]
  boolArrExpl: boolean[]
  boolArr: boolean[]
  enmArrExpl: CommonEnumType[]
  enmArr: CommonEnumType[]
  objExpl: CommonObjectType
  obj: CommonObjectType
}

export type MatrixPathParametersPathParameters = {
  strExpl: string
  str: string
  numExpl: number
  num: number
  boolExpl: boolean
  bool: boolean
  enmExpl: CommonEnumType
  enm: CommonEnumType
  strArrExpl: string[]
  strArr: string[]
  numArrExpl: number[]
  numArr: number[]
  boolArrExpl: boolean[]
  boolArr: boolean[]
  enmArrExpl: CommonEnumType[]
  enmArr: CommonEnumType[]
  objExpl: CommonObjectType
  obj: CommonObjectType
}

export type SimplePathParametersPathParameters = {
  strExpl: string
  str: string
  numExpl: number
  num: number
  boolExpl: boolean
  bool: boolean
  enmExpl: CommonEnumType
  enm: CommonEnumType
  strArrExpl: string[]
  strArr: string[]
  numArrExpl: number[]
  numArr: number[]
  boolArrExpl: boolean[]
  boolArr: boolean[]
  enmArrExpl: CommonEnumType[]
  enmArr: CommonEnumType[]
  objExpl: CommonObjectType
  obj: CommonObjectType
}

export type SimpleHeaderParametersRequestHeaderParameters = {
  'X-StrExpl-Header': string
  'X-OptStrExpl-Header'?: string
  'X-Str-Header': string
  'X-OptStr-Header'?: string
  'X-NumExpl-Header': number
  'X-OptNumExpl-Header'?: number
  'X-Num-Header': number
  'X-OptNum-Header'?: number
  'X-BoolExpl-Header': boolean
  'X-OptBoolExpl-Header'?: boolean
  'X-Bool-Header': boolean
  'X-OptBool-Header'?: boolean
  'X-EnmExpl-Header': CommonEnumType
  'X-OptEnmExpl-Header'?: CommonEnumType
  'X-Enm-Header': CommonEnumType
  'X-OptEnm-Header'?: CommonEnumType
  'X-StrArrExpl-Header': string[]
  'X-OptStrArrExpl-Header'?: string[]
  'X-StrArr-Header': string[]
  'X-OptStrArr-Header'?: string[]
  'X-NumArrExpl-Header': number[]
  'X-OptNumArrExpl-Header'?: number[]
  'X-NumArr-Header': number[]
  'X-OptNumArr-Header'?: number[]
  'X-BoolArrExpl-Header': boolean[]
  'X-OptBoolArrExpl-Header'?: boolean[]
  'X-BoolArr-Header': boolean[]
  'X-OptBoolArr-Header'?: boolean[]
  'X-EnmArrExpl-Header': CommonEnumType[]
  'X-OptEnmArrExpl-Header'?: CommonEnumType[]
  'X-EnmArr-Header': CommonEnumType[]
  'X-OptEnmArr-Header'?: CommonEnumType[]
  'X-ObjExpl-Header': CommonObjectType
  'X-OptObjExpl-Header'?: CommonObjectType
  'X-Obj-Header': CommonObjectType
  'X-OptObj-Header'?: CommonObjectType
}

export type DeepObjectQueryParametersRequest = HasQueryParameters<DeepObjectQueryParametersQueryParameters>

export type FormQueryParametersRequest = HasQueryParameters<FormQueryParametersQueryParameters>

export type LabelPathParametersRequest = HasPathParameters<LabelPathParametersPathParameters>

export type MatrixPathParametersRequest = HasPathParameters<MatrixPathParametersPathParameters>

export type PipeDelimitedQueryParametersRequest = HasQueryParameters<PipeDelimitedQueryParametersQueryParameters>

export type SimpleHeaderParametersRequest = HasHeaders<SimpleHeaderParametersRequestHeaderParameters>

export type SimplePathParametersRequest = HasPathParameters<SimplePathParametersPathParameters>

export type SpaceDelimitedQueryParametersRequest = HasQueryParameters<SpaceDelimitedQueryParametersQueryParameters>

export type DeepObjectQueryParametersServerRequest =
  | (Partial<DeepObjectQueryParametersRequest> & HasIssues)
  | (DeepObjectQueryParametersRequest & HasNoIssues)

export type FormQueryParametersServerRequest =
  | (Partial<FormQueryParametersRequest> & HasIssues)
  | (FormQueryParametersRequest & HasNoIssues)

export type LabelPathParametersServerRequest =
  | (Partial<LabelPathParametersRequest> & HasIssues)
  | (LabelPathParametersRequest & HasNoIssues)

export type MatrixPathParametersServerRequest =
  | (Partial<MatrixPathParametersRequest> & HasIssues)
  | (MatrixPathParametersRequest & HasNoIssues)

export type PipeDelimitedQueryParametersServerRequest =
  | (Partial<PipeDelimitedQueryParametersRequest> & HasIssues)
  | (PipeDelimitedQueryParametersRequest & HasNoIssues)

export type SimpleHeaderParametersServerRequest =
  | (Partial<SimpleHeaderParametersRequest> & HasIssues)
  | (SimpleHeaderParametersRequest & HasNoIssues)

export type SimplePathParametersServerRequest =
  | (Partial<SimplePathParametersRequest> & HasIssues)
  | (SimplePathParametersRequest & HasNoIssues)

export type SpaceDelimitedQueryParametersServerRequest =
  | (Partial<SpaceDelimitedQueryParametersRequest> & HasIssues)
  | (SpaceDelimitedQueryParametersRequest & HasNoIssues)

export const deepObjectQueryParametersResponseBodyValidator = {
  200: { 'application/json': deepObjectQueryParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const formQueryParametersResponseBodyValidator = {
  200: { 'application/json': formQueryParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const labelPathParametersResponseBodyValidator = {
  200: { 'application/json': labelPathParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const matrixPathParametersResponseBodyValidator = {
  200: { 'application/json': matrixPathParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const pipeDelimitedQueryParametersResponseBodyValidator = {
  200: { 'application/json': pipeDelimitedQueryParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const simpleHeaderParametersResponseBodyValidator = {
  200: { 'application/json': simpleHeaderParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const simplePathParametersResponseBodyValidator = {
  200: { 'application/json': simplePathParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export const spaceDelimitedQueryParametersResponseBodyValidator = {
  200: { 'application/json': spaceDelimitedQueryParametersTypeValidator },
  400: { 'application/json': array(items(lazy(() => parameterIssueTypeValidator))) },
} as const

export type DeepObjectQueryParametersResponse =
  | HttpResponse<DeepObjectQueryParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type FormQueryParametersResponse =
  | HttpResponse<FormQueryParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type LabelPathParametersResponse =
  | HttpResponse<LabelPathParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type MatrixPathParametersResponse =
  | HttpResponse<MatrixPathParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type PipeDelimitedQueryParametersResponse =
  | HttpResponse<PipeDelimitedQueryParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type SimpleHeaderParametersResponse =
  | HttpResponse<SimpleHeaderParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type SimplePathParametersResponse =
  | HttpResponse<SimplePathParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export type SpaceDelimitedQueryParametersResponse =
  | HttpResponse<SpaceDelimitedQueryParameters, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export const labelPathParametersPathSerializer = createPathSerializer<LabelPathParametersPathParameters>(
  '/label-path-parameters/{strExpl}/{str}/{numExpl}/{num}/{boolExpl}/{bool}/{enmExpl}/{enm}/{strArrExpl}/{strArr}/{numArrExpl}/{numArr}/{boolArrExpl}/{boolArr}/{enmArrExpl}/{enmArr}/{objExpl}/{obj}',
  {
    strExpl: serializers.path.label.primitive<string>({ explode: true }),
    str: serializers.path.label.primitive<string>({ explode: false }),
    numExpl: serializers.path.label.primitive<number>({ explode: true }),
    num: serializers.path.label.primitive<number>({ explode: false }),
    boolExpl: serializers.path.label.primitive<boolean>({ explode: true }),
    bool: serializers.path.label.primitive<boolean>({ explode: false }),
    enmExpl: serializers.path.label.primitive<CommonEnumType>({ explode: true }),
    enm: serializers.path.label.primitive<CommonEnumType>({ explode: false }),
    strArrExpl: serializers.path.label.array<string[]>({ explode: true }),
    strArr: serializers.path.label.array<string[]>({ explode: false }),
    numArrExpl: serializers.path.label.array<number[]>({ explode: true }),
    numArr: serializers.path.label.array<number[]>({ explode: false }),
    boolArrExpl: serializers.path.label.array<boolean[]>({ explode: true }),
    boolArr: serializers.path.label.array<boolean[]>({ explode: false }),
    enmArrExpl: serializers.path.label.array<CommonEnumType[]>({ explode: true }),
    enmArr: serializers.path.label.array<CommonEnumType[]>({ explode: false }),
    objExpl: serializers.path.label.object<CommonObjectType>({ explode: true }),
    obj: serializers.path.label.object<CommonObjectType>({ explode: false }),
  },
)

export const matrixPathParametersPathSerializer = createPathSerializer<MatrixPathParametersPathParameters>(
  '/matrix-path-parameters/{strExpl}/{str}/{numExpl}/{num}/{boolExpl}/{bool}/{enmExpl}/{enm}/{strArrExpl}/{strArr}/{numArrExpl}/{numArr}/{boolArrExpl}/{boolArr}/{enmArrExpl}/{enmArr}/{objExpl}/{obj}',
  {
    strExpl: serializers.path.matrix.primitive<string>({ explode: true }),
    str: serializers.path.matrix.primitive<string>({ explode: false }),
    numExpl: serializers.path.matrix.primitive<number>({ explode: true }),
    num: serializers.path.matrix.primitive<number>({ explode: false }),
    boolExpl: serializers.path.matrix.primitive<boolean>({ explode: true }),
    bool: serializers.path.matrix.primitive<boolean>({ explode: false }),
    enmExpl: serializers.path.matrix.primitive<CommonEnumType>({ explode: true }),
    enm: serializers.path.matrix.primitive<CommonEnumType>({ explode: false }),
    strArrExpl: serializers.path.matrix.array<string[]>({ explode: true }),
    strArr: serializers.path.matrix.array<string[]>({ explode: false }),
    numArrExpl: serializers.path.matrix.array<number[]>({ explode: true }),
    numArr: serializers.path.matrix.array<number[]>({ explode: false }),
    boolArrExpl: serializers.path.matrix.array<boolean[]>({ explode: true }),
    boolArr: serializers.path.matrix.array<boolean[]>({ explode: false }),
    enmArrExpl: serializers.path.matrix.array<CommonEnumType[]>({ explode: true }),
    enmArr: serializers.path.matrix.array<CommonEnumType[]>({ explode: false }),
    objExpl: serializers.path.matrix.object<CommonObjectType>({ explode: true }),
    obj: serializers.path.matrix.object<CommonObjectType>({ explode: false }),
  },
)

export const simplePathParametersPathSerializer = createPathSerializer<SimplePathParametersPathParameters>(
  '/simple-path-parameters/{strExpl}/{str}/{numExpl}/{num}/{boolExpl}/{bool}/{enmExpl}/{enm}/{strArrExpl}/{strArr}/{numArrExpl}/{numArr}/{boolArrExpl}/{boolArr}/{enmArrExpl}/{enmArr}/{objExpl}/{obj}',
  {
    strExpl: serializers.path.simple.primitive<string>({ explode: true }),
    str: serializers.path.simple.primitive<string>({ explode: false }),
    numExpl: serializers.path.simple.primitive<number>({ explode: true }),
    num: serializers.path.simple.primitive<number>({ explode: false }),
    boolExpl: serializers.path.simple.primitive<boolean>({ explode: true }),
    bool: serializers.path.simple.primitive<boolean>({ explode: false }),
    enmExpl: serializers.path.simple.primitive<CommonEnumType>({ explode: true }),
    enm: serializers.path.simple.primitive<CommonEnumType>({ explode: false }),
    strArrExpl: serializers.path.simple.array<string[]>({ explode: true }),
    strArr: serializers.path.simple.array<string[]>({ explode: false }),
    numArrExpl: serializers.path.simple.array<number[]>({ explode: true }),
    numArr: serializers.path.simple.array<number[]>({ explode: false }),
    boolArrExpl: serializers.path.simple.array<boolean[]>({ explode: true }),
    boolArr: serializers.path.simple.array<boolean[]>({ explode: false }),
    enmArrExpl: serializers.path.simple.array<CommonEnumType[]>({ explode: true }),
    enmArr: serializers.path.simple.array<CommonEnumType[]>({ explode: false }),
    objExpl: serializers.path.simple.object<CommonObjectType>({ explode: true }),
    obj: serializers.path.simple.object<CommonObjectType>({ explode: false }),
  },
)

export const deepObjectQueryParametersQuerySerializer = createQuerySerializer<DeepObjectQueryParametersQueryParameters>(
  {
    objExpl: serializers.query.deepObject.object<CommonObjectType>({ explode: true, required: true }),
    optObjExpl: serializers.query.deepObject.object<CommonObjectType>({ explode: true, required: false }),
  },
)

export const formQueryParametersQuerySerializer = createQuerySerializer<FormQueryParametersQueryParameters>({
  strExpl: serializers.query.form.primitive<string>({ explode: true, required: true }),
  optStrExpl: serializers.query.form.primitive<string>({ explode: true, required: false }),
  str: serializers.query.form.primitive<string>({ explode: false, required: true }),
  optStr: serializers.query.form.primitive<string>({ explode: false, required: false }),
  numExpl: serializers.query.form.primitive<number>({ explode: true, required: true }),
  optNumExpl: serializers.query.form.primitive<number>({ explode: true, required: false }),
  num: serializers.query.form.primitive<number>({ explode: false, required: true }),
  optNum: serializers.query.form.primitive<number>({ explode: false, required: false }),
  boolExpl: serializers.query.form.primitive<boolean>({ explode: true, required: true }),
  optBoolExpl: serializers.query.form.primitive<boolean>({ explode: true, required: false }),
  bool: serializers.query.form.primitive<boolean>({ explode: false, required: true }),
  optBool: serializers.query.form.primitive<boolean>({ explode: false, required: false }),
  enmExpl: serializers.query.form.primitive<CommonEnumType>({ explode: true, required: true }),
  optEnmExpl: serializers.query.form.primitive<CommonEnumType>({ explode: true, required: false }),
  enm: serializers.query.form.primitive<CommonEnumType>({ explode: false, required: true }),
  optEnm: serializers.query.form.primitive<CommonEnumType>({ explode: false, required: false }),
  strArrExpl: serializers.query.form.array<string[]>({ explode: true, required: true }),
  optStrArrExpl: serializers.query.form.array<string[]>({ explode: true, required: false }),
  strArr: serializers.query.form.array<string[]>({ explode: false, required: true }),
  optStrArr: serializers.query.form.array<string[]>({ explode: false, required: false }),
  numArrExpl: serializers.query.form.array<number[]>({ explode: true, required: true }),
  optNumArrExpl: serializers.query.form.array<number[]>({ explode: true, required: false }),
  numArr: serializers.query.form.array<number[]>({ explode: false, required: true }),
  optNumArr: serializers.query.form.array<number[]>({ explode: false, required: false }),
  boolArrExpl: serializers.query.form.array<boolean[]>({ explode: true, required: true }),
  optBoolArrExpl: serializers.query.form.array<boolean[]>({ explode: true, required: false }),
  boolArr: serializers.query.form.array<boolean[]>({ explode: false, required: true }),
  optBoolArr: serializers.query.form.array<boolean[]>({ explode: false, required: false }),
  enmArrExpl: serializers.query.form.array<CommonEnumType[]>({ explode: true, required: true }),
  optEnmArrExpl: serializers.query.form.array<CommonEnumType[]>({ explode: true, required: false }),
  enmArr: serializers.query.form.array<CommonEnumType[]>({ explode: false, required: true }),
  optEnmArr: serializers.query.form.array<CommonEnumType[]>({ explode: false, required: false }),
  objExpl: serializers.query.form.object<CommonObjectType>({ explode: true, required: true }),
  optObjExpl: serializers.query.form.object<CommonObjectType>({ explode: true, required: false }),
  obj: serializers.query.form.object<CommonObjectType>({ explode: false, required: true }),
  optObj: serializers.query.form.object<CommonObjectType>({ explode: false, required: false }),
})

export const pipeDelimitedQueryParametersQuerySerializer =
  createQuerySerializer<PipeDelimitedQueryParametersQueryParameters>({
    strArrExpl: serializers.query.pipeDelimited.array<string[]>({ explode: true, required: true }),
    optStrArrExpl: serializers.query.pipeDelimited.array<string[]>({ explode: true, required: false }),
    numArrExpl: serializers.query.pipeDelimited.array<number[]>({ explode: true, required: true }),
    optNumArrExpl: serializers.query.pipeDelimited.array<number[]>({ explode: true, required: false }),
    boolArrExpl: serializers.query.pipeDelimited.array<boolean[]>({ explode: true, required: true }),
    optBoolArrExpl: serializers.query.pipeDelimited.array<boolean[]>({ explode: true, required: false }),
    enmArrExpl: serializers.query.pipeDelimited.array<CommonEnumType[]>({ explode: true, required: true }),
    optEnmArrExpl: serializers.query.pipeDelimited.array<CommonEnumType[]>({ explode: true, required: false }),
  })

export const spaceDelimitedQueryParametersQuerySerializer =
  createQuerySerializer<SpaceDelimitedQueryParametersQueryParameters>({
    strArrExpl: serializers.query.spaceDelimited.array<string[]>({ explode: true, required: true }),
    optStrArrExpl: serializers.query.spaceDelimited.array<string[]>({ explode: true, required: false }),
    numArrExpl: serializers.query.spaceDelimited.array<number[]>({ explode: true, required: true }),
    optNumArrExpl: serializers.query.spaceDelimited.array<number[]>({ explode: true, required: false }),
    boolArrExpl: serializers.query.spaceDelimited.array<boolean[]>({ explode: true, required: true }),
    optBoolArrExpl: serializers.query.spaceDelimited.array<boolean[]>({ explode: true, required: false }),
    enmArrExpl: serializers.query.spaceDelimited.array<CommonEnumType[]>({ explode: true, required: true }),
    optEnmArrExpl: serializers.query.spaceDelimited.array<CommonEnumType[]>({ explode: true, required: false }),
  })

export const simpleHeaderParametersRequestHeadersSerializer =
  createHeaderSerializer<SimpleHeaderParametersRequestHeaderParameters>({
    'X-StrExpl-Header': serializers.header.simple.primitive<string>({ explode: true, required: true }),
    'X-OptStrExpl-Header': serializers.header.simple.primitive<string>({ explode: true, required: false }),
    'X-Str-Header': serializers.header.simple.primitive<string>({ explode: false, required: true }),
    'X-OptStr-Header': serializers.header.simple.primitive<string>({ explode: false, required: false }),
    'X-NumExpl-Header': serializers.header.simple.primitive<number>({ explode: true, required: true }),
    'X-OptNumExpl-Header': serializers.header.simple.primitive<number>({ explode: true, required: false }),
    'X-Num-Header': serializers.header.simple.primitive<number>({ explode: false, required: true }),
    'X-OptNum-Header': serializers.header.simple.primitive<number>({ explode: false, required: false }),
    'X-BoolExpl-Header': serializers.header.simple.primitive<boolean>({ explode: true, required: true }),
    'X-OptBoolExpl-Header': serializers.header.simple.primitive<boolean>({ explode: true, required: false }),
    'X-Bool-Header': serializers.header.simple.primitive<boolean>({ explode: false, required: true }),
    'X-OptBool-Header': serializers.header.simple.primitive<boolean>({ explode: false, required: false }),
    'X-EnmExpl-Header': serializers.header.simple.primitive<CommonEnumType>({ explode: true, required: true }),
    'X-OptEnmExpl-Header': serializers.header.simple.primitive<CommonEnumType>({ explode: true, required: false }),
    'X-Enm-Header': serializers.header.simple.primitive<CommonEnumType>({ explode: false, required: true }),
    'X-OptEnm-Header': serializers.header.simple.primitive<CommonEnumType>({ explode: false, required: false }),
    'X-StrArrExpl-Header': serializers.header.simple.array<string[]>({ explode: true, required: true }),
    'X-OptStrArrExpl-Header': serializers.header.simple.array<string[]>({ explode: true, required: false }),
    'X-StrArr-Header': serializers.header.simple.array<string[]>({ explode: false, required: true }),
    'X-OptStrArr-Header': serializers.header.simple.array<string[]>({ explode: false, required: false }),
    'X-NumArrExpl-Header': serializers.header.simple.array<number[]>({ explode: true, required: true }),
    'X-OptNumArrExpl-Header': serializers.header.simple.array<number[]>({ explode: true, required: false }),
    'X-NumArr-Header': serializers.header.simple.array<number[]>({ explode: false, required: true }),
    'X-OptNumArr-Header': serializers.header.simple.array<number[]>({ explode: false, required: false }),
    'X-BoolArrExpl-Header': serializers.header.simple.array<boolean[]>({ explode: true, required: true }),
    'X-OptBoolArrExpl-Header': serializers.header.simple.array<boolean[]>({ explode: true, required: false }),
    'X-BoolArr-Header': serializers.header.simple.array<boolean[]>({ explode: false, required: true }),
    'X-OptBoolArr-Header': serializers.header.simple.array<boolean[]>({ explode: false, required: false }),
    'X-EnmArrExpl-Header': serializers.header.simple.array<CommonEnumType[]>({ explode: true, required: true }),
    'X-OptEnmArrExpl-Header': serializers.header.simple.array<CommonEnumType[]>({ explode: true, required: false }),
    'X-EnmArr-Header': serializers.header.simple.array<CommonEnumType[]>({ explode: false, required: true }),
    'X-OptEnmArr-Header': serializers.header.simple.array<CommonEnumType[]>({ explode: false, required: false }),
    'X-ObjExpl-Header': serializers.header.simple.object<CommonObjectType>({ explode: true, required: true }),
    'X-OptObjExpl-Header': serializers.header.simple.object<CommonObjectType>({ explode: true, required: false }),
    'X-Obj-Header': serializers.header.simple.object<CommonObjectType>({ explode: false, required: true }),
    'X-OptObj-Header': serializers.header.simple.object<CommonObjectType>({ explode: false, required: false }),
  })

export const labelPathParametersPathDeserializer = createPathDeserializer<LabelPathParametersPathParameters>(
  [
    'strExpl',
    'str',
    'numExpl',
    'num',
    'boolExpl',
    'bool',
    'enmExpl',
    'enm',
    'strArrExpl',
    'strArr',
    'numArrExpl',
    'numArr',
    'boolArrExpl',
    'boolArr',
    'enmArrExpl',
    'enmArr',
    'objExpl',
    'obj',
  ],
  /^\/label-path-parameters(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  {
    strExpl: deserializers.path.label.primitive(deserializers.value.string(), { explode: true }),
    str: deserializers.path.label.primitive(deserializers.value.string(), { explode: false }),
    numExpl: deserializers.path.label.primitive(deserializers.value.number(), { explode: true }),
    num: deserializers.path.label.primitive(deserializers.value.number(), { explode: false }),
    boolExpl: deserializers.path.label.primitive(deserializers.value.boolean(), { explode: true }),
    bool: deserializers.path.label.primitive(deserializers.value.boolean(), { explode: false }),
    enmExpl: deserializers.path.label.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true },
    ),
    enm: deserializers.path.label.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false },
    ),
    strArrExpl: deserializers.path.label.array(deserializers.value.string(), { explode: true }),
    strArr: deserializers.path.label.array(deserializers.value.string(), { explode: false }),
    numArrExpl: deserializers.path.label.array(deserializers.value.number(), { explode: true }),
    numArr: deserializers.path.label.array(deserializers.value.number(), { explode: false }),
    boolArrExpl: deserializers.path.label.array(deserializers.value.boolean(), { explode: true }),
    boolArr: deserializers.path.label.array(deserializers.value.boolean(), { explode: false }),
    enmArrExpl: deserializers.path.label.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true },
    ),
    enmArr: deserializers.path.label.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false },
    ),
    objExpl: deserializers.path.label.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true },
    ),
    obj: deserializers.path.label.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: false },
    ),
  },
)

export const matrixPathParametersPathDeserializer = createPathDeserializer<MatrixPathParametersPathParameters>(
  [
    'strExpl',
    'str',
    'numExpl',
    'num',
    'boolExpl',
    'bool',
    'enmExpl',
    'enm',
    'strArrExpl',
    'strArr',
    'numArrExpl',
    'numArr',
    'boolArrExpl',
    'boolArr',
    'enmArrExpl',
    'enmArr',
    'objExpl',
    'obj',
  ],
  /^\/matrix-path-parameters(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  {
    strExpl: deserializers.path.matrix.primitive(deserializers.value.string(), { explode: true }),
    str: deserializers.path.matrix.primitive(deserializers.value.string(), { explode: false }),
    numExpl: deserializers.path.matrix.primitive(deserializers.value.number(), { explode: true }),
    num: deserializers.path.matrix.primitive(deserializers.value.number(), { explode: false }),
    boolExpl: deserializers.path.matrix.primitive(deserializers.value.boolean(), { explode: true }),
    bool: deserializers.path.matrix.primitive(deserializers.value.boolean(), { explode: false }),
    enmExpl: deserializers.path.matrix.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true },
    ),
    enm: deserializers.path.matrix.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false },
    ),
    strArrExpl: deserializers.path.matrix.array(deserializers.value.string(), { explode: true }),
    strArr: deserializers.path.matrix.array(deserializers.value.string(), { explode: false }),
    numArrExpl: deserializers.path.matrix.array(deserializers.value.number(), { explode: true }),
    numArr: deserializers.path.matrix.array(deserializers.value.number(), { explode: false }),
    boolArrExpl: deserializers.path.matrix.array(deserializers.value.boolean(), { explode: true }),
    boolArr: deserializers.path.matrix.array(deserializers.value.boolean(), { explode: false }),
    enmArrExpl: deserializers.path.matrix.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true },
    ),
    enmArr: deserializers.path.matrix.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false },
    ),
    objExpl: deserializers.path.matrix.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true },
    ),
    obj: deserializers.path.matrix.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: false },
    ),
  },
)

export const simplePathParametersPathDeserializer = createPathDeserializer<SimplePathParametersPathParameters>(
  [
    'strExpl',
    'str',
    'numExpl',
    'num',
    'boolExpl',
    'bool',
    'enmExpl',
    'enm',
    'strArrExpl',
    'strArr',
    'numArrExpl',
    'numArr',
    'boolArrExpl',
    'boolArr',
    'enmArrExpl',
    'enmArr',
    'objExpl',
    'obj',
  ],
  /^\/simple-path-parameters(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  {
    strExpl: deserializers.path.simple.primitive(deserializers.value.string(), { explode: true }),
    str: deserializers.path.simple.primitive(deserializers.value.string(), { explode: false }),
    numExpl: deserializers.path.simple.primitive(deserializers.value.number(), { explode: true }),
    num: deserializers.path.simple.primitive(deserializers.value.number(), { explode: false }),
    boolExpl: deserializers.path.simple.primitive(deserializers.value.boolean(), { explode: true }),
    bool: deserializers.path.simple.primitive(deserializers.value.boolean(), { explode: false }),
    enmExpl: deserializers.path.simple.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true },
    ),
    enm: deserializers.path.simple.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false },
    ),
    strArrExpl: deserializers.path.simple.array(deserializers.value.string(), { explode: true }),
    strArr: deserializers.path.simple.array(deserializers.value.string(), { explode: false }),
    numArrExpl: deserializers.path.simple.array(deserializers.value.number(), { explode: true }),
    numArr: deserializers.path.simple.array(deserializers.value.number(), { explode: false }),
    boolArrExpl: deserializers.path.simple.array(deserializers.value.boolean(), { explode: true }),
    boolArr: deserializers.path.simple.array(deserializers.value.boolean(), { explode: false }),
    enmArrExpl: deserializers.path.simple.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true },
    ),
    enmArr: deserializers.path.simple.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false },
    ),
    objExpl: deserializers.path.simple.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true },
    ),
    obj: deserializers.path.simple.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: false },
    ),
  },
)

export const deepObjectQueryParametersQueryDeserializer =
  createQueryDeserializer<DeepObjectQueryParametersQueryParameters>({
    objExpl: deserializers.query.deepObject.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true, required: true },
    ),
    optObjExpl: deserializers.query.deepObject.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true, required: false },
    ),
  })

export const formQueryParametersQueryDeserializer = createQueryDeserializer<FormQueryParametersQueryParameters>({
  strExpl: deserializers.query.form.primitive(deserializers.value.string(), { explode: true, required: true }),
  optStrExpl: deserializers.query.form.primitive(deserializers.value.string(), { explode: true, required: false }),
  str: deserializers.query.form.primitive(deserializers.value.string(), { explode: false, required: true }),
  optStr: deserializers.query.form.primitive(deserializers.value.string(), { explode: false, required: false }),
  numExpl: deserializers.query.form.primitive(deserializers.value.number(), { explode: true, required: true }),
  optNumExpl: deserializers.query.form.primitive(deserializers.value.number(), { explode: true, required: false }),
  num: deserializers.query.form.primitive(deserializers.value.number(), { explode: false, required: true }),
  optNum: deserializers.query.form.primitive(deserializers.value.number(), { explode: false, required: false }),
  boolExpl: deserializers.query.form.primitive(deserializers.value.boolean(), { explode: true, required: true }),
  optBoolExpl: deserializers.query.form.primitive(deserializers.value.boolean(), { explode: true, required: false }),
  bool: deserializers.query.form.primitive(deserializers.value.boolean(), { explode: false, required: true }),
  optBool: deserializers.query.form.primitive(deserializers.value.boolean(), { explode: false, required: false }),
  enmExpl: deserializers.query.form.primitive(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: true, required: true },
  ),
  optEnmExpl: deserializers.query.form.primitive(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: true, required: false },
  ),
  enm: deserializers.query.form.primitive(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: false, required: true },
  ),
  optEnm: deserializers.query.form.primitive(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: false, required: false },
  ),
  strArrExpl: deserializers.query.form.array(deserializers.value.string(), { explode: true, required: true }),
  optStrArrExpl: deserializers.query.form.array(deserializers.value.string(), { explode: true, required: false }),
  strArr: deserializers.query.form.array(deserializers.value.string(), { explode: false, required: true }),
  optStrArr: deserializers.query.form.array(deserializers.value.string(), { explode: false, required: false }),
  numArrExpl: deserializers.query.form.array(deserializers.value.number(), { explode: true, required: true }),
  optNumArrExpl: deserializers.query.form.array(deserializers.value.number(), { explode: true, required: false }),
  numArr: deserializers.query.form.array(deserializers.value.number(), { explode: false, required: true }),
  optNumArr: deserializers.query.form.array(deserializers.value.number(), { explode: false, required: false }),
  boolArrExpl: deserializers.query.form.array(deserializers.value.boolean(), { explode: true, required: true }),
  optBoolArrExpl: deserializers.query.form.array(deserializers.value.boolean(), { explode: true, required: false }),
  boolArr: deserializers.query.form.array(deserializers.value.boolean(), { explode: false, required: true }),
  optBoolArr: deserializers.query.form.array(deserializers.value.boolean(), { explode: false, required: false }),
  enmArrExpl: deserializers.query.form.array(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: true, required: true },
  ),
  optEnmArrExpl: deserializers.query.form.array(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: true, required: false },
  ),
  enmArr: deserializers.query.form.array(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: false, required: true },
  ),
  optEnmArr: deserializers.query.form.array(
    deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
    { explode: false, required: false },
  ),
  objExpl: deserializers.query.form.object(
    {
      str: deserializers.value.string(),
      num: deserializers.value.number(),
      bool: deserializers.value.boolean(),
      enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      optStr: deserializers.value.optional(deserializers.value.string()),
      optNum: deserializers.value.optional(deserializers.value.number()),
      optBool: deserializers.value.optional(deserializers.value.boolean()),
      optEnm: deserializers.value.optional(
        deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      ),
    },
    { explode: true, required: true },
  ),
  optObjExpl: deserializers.query.form.object(
    {
      str: deserializers.value.string(),
      num: deserializers.value.number(),
      bool: deserializers.value.boolean(),
      enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      optStr: deserializers.value.optional(deserializers.value.string()),
      optNum: deserializers.value.optional(deserializers.value.number()),
      optBool: deserializers.value.optional(deserializers.value.boolean()),
      optEnm: deserializers.value.optional(
        deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      ),
    },
    { explode: true, required: false },
  ),
  obj: deserializers.query.form.object(
    {
      str: deserializers.value.string(),
      num: deserializers.value.number(),
      bool: deserializers.value.boolean(),
      enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      optStr: deserializers.value.optional(deserializers.value.string()),
      optNum: deserializers.value.optional(deserializers.value.number()),
      optBool: deserializers.value.optional(deserializers.value.boolean()),
      optEnm: deserializers.value.optional(
        deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      ),
    },
    { explode: false, required: true },
  ),
  optObj: deserializers.query.form.object(
    {
      str: deserializers.value.string(),
      num: deserializers.value.number(),
      bool: deserializers.value.boolean(),
      enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      optStr: deserializers.value.optional(deserializers.value.string()),
      optNum: deserializers.value.optional(deserializers.value.number()),
      optBool: deserializers.value.optional(deserializers.value.boolean()),
      optEnm: deserializers.value.optional(
        deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      ),
    },
    { explode: false, required: false },
  ),
})

export const pipeDelimitedQueryParametersQueryDeserializer =
  createQueryDeserializer<PipeDelimitedQueryParametersQueryParameters>({
    strArrExpl: deserializers.query.pipeDelimited.array(deserializers.value.string(), {
      explode: true,
      required: true,
    }),
    optStrArrExpl: deserializers.query.pipeDelimited.array(deserializers.value.string(), {
      explode: true,
      required: false,
    }),
    numArrExpl: deserializers.query.pipeDelimited.array(deserializers.value.number(), {
      explode: true,
      required: true,
    }),
    optNumArrExpl: deserializers.query.pipeDelimited.array(deserializers.value.number(), {
      explode: true,
      required: false,
    }),
    boolArrExpl: deserializers.query.pipeDelimited.array(deserializers.value.boolean(), {
      explode: true,
      required: true,
    }),
    optBoolArrExpl: deserializers.query.pipeDelimited.array(deserializers.value.boolean(), {
      explode: true,
      required: false,
    }),
    enmArrExpl: deserializers.query.pipeDelimited.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: true },
    ),
    optEnmArrExpl: deserializers.query.pipeDelimited.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: false },
    ),
  })

export const spaceDelimitedQueryParametersQueryDeserializer =
  createQueryDeserializer<SpaceDelimitedQueryParametersQueryParameters>({
    strArrExpl: deserializers.query.spaceDelimited.array(deserializers.value.string(), {
      explode: true,
      required: true,
    }),
    optStrArrExpl: deserializers.query.spaceDelimited.array(deserializers.value.string(), {
      explode: true,
      required: false,
    }),
    numArrExpl: deserializers.query.spaceDelimited.array(deserializers.value.number(), {
      explode: true,
      required: true,
    }),
    optNumArrExpl: deserializers.query.spaceDelimited.array(deserializers.value.number(), {
      explode: true,
      required: false,
    }),
    boolArrExpl: deserializers.query.spaceDelimited.array(deserializers.value.boolean(), {
      explode: true,
      required: true,
    }),
    optBoolArrExpl: deserializers.query.spaceDelimited.array(deserializers.value.boolean(), {
      explode: true,
      required: false,
    }),
    enmArrExpl: deserializers.query.spaceDelimited.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: true },
    ),
    optEnmArrExpl: deserializers.query.spaceDelimited.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: false },
    ),
  })

export const simpleHeaderParametersRequestHeadersDeserializer =
  createHeaderDeserializer<SimpleHeaderParametersRequestHeaderParameters>({
    'X-StrExpl-Header': deserializers.header.simple.primitive(deserializers.value.string(), {
      explode: true,
      required: true,
    }),
    'X-OptStrExpl-Header': deserializers.header.simple.primitive(deserializers.value.string(), {
      explode: true,
      required: false,
    }),
    'X-Str-Header': deserializers.header.simple.primitive(deserializers.value.string(), {
      explode: false,
      required: true,
    }),
    'X-OptStr-Header': deserializers.header.simple.primitive(deserializers.value.string(), {
      explode: false,
      required: false,
    }),
    'X-NumExpl-Header': deserializers.header.simple.primitive(deserializers.value.number(), {
      explode: true,
      required: true,
    }),
    'X-OptNumExpl-Header': deserializers.header.simple.primitive(deserializers.value.number(), {
      explode: true,
      required: false,
    }),
    'X-Num-Header': deserializers.header.simple.primitive(deserializers.value.number(), {
      explode: false,
      required: true,
    }),
    'X-OptNum-Header': deserializers.header.simple.primitive(deserializers.value.number(), {
      explode: false,
      required: false,
    }),
    'X-BoolExpl-Header': deserializers.header.simple.primitive(deserializers.value.boolean(), {
      explode: true,
      required: true,
    }),
    'X-OptBoolExpl-Header': deserializers.header.simple.primitive(deserializers.value.boolean(), {
      explode: true,
      required: false,
    }),
    'X-Bool-Header': deserializers.header.simple.primitive(deserializers.value.boolean(), {
      explode: false,
      required: true,
    }),
    'X-OptBool-Header': deserializers.header.simple.primitive(deserializers.value.boolean(), {
      explode: false,
      required: false,
    }),
    'X-EnmExpl-Header': deserializers.header.simple.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: true },
    ),
    'X-OptEnmExpl-Header': deserializers.header.simple.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: false },
    ),
    'X-Enm-Header': deserializers.header.simple.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false, required: true },
    ),
    'X-OptEnm-Header': deserializers.header.simple.primitive(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false, required: false },
    ),
    'X-StrArrExpl-Header': deserializers.header.simple.array(deserializers.value.string(), {
      explode: true,
      required: true,
    }),
    'X-OptStrArrExpl-Header': deserializers.header.simple.array(deserializers.value.string(), {
      explode: true,
      required: false,
    }),
    'X-StrArr-Header': deserializers.header.simple.array(deserializers.value.string(), {
      explode: false,
      required: true,
    }),
    'X-OptStrArr-Header': deserializers.header.simple.array(deserializers.value.string(), {
      explode: false,
      required: false,
    }),
    'X-NumArrExpl-Header': deserializers.header.simple.array(deserializers.value.number(), {
      explode: true,
      required: true,
    }),
    'X-OptNumArrExpl-Header': deserializers.header.simple.array(deserializers.value.number(), {
      explode: true,
      required: false,
    }),
    'X-NumArr-Header': deserializers.header.simple.array(deserializers.value.number(), {
      explode: false,
      required: true,
    }),
    'X-OptNumArr-Header': deserializers.header.simple.array(deserializers.value.number(), {
      explode: false,
      required: false,
    }),
    'X-BoolArrExpl-Header': deserializers.header.simple.array(deserializers.value.boolean(), {
      explode: true,
      required: true,
    }),
    'X-OptBoolArrExpl-Header': deserializers.header.simple.array(deserializers.value.boolean(), {
      explode: true,
      required: false,
    }),
    'X-BoolArr-Header': deserializers.header.simple.array(deserializers.value.boolean(), {
      explode: false,
      required: true,
    }),
    'X-OptBoolArr-Header': deserializers.header.simple.array(deserializers.value.boolean(), {
      explode: false,
      required: false,
    }),
    'X-EnmArrExpl-Header': deserializers.header.simple.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: true },
    ),
    'X-OptEnmArrExpl-Header': deserializers.header.simple.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: true, required: false },
    ),
    'X-EnmArr-Header': deserializers.header.simple.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false, required: true },
    ),
    'X-OptEnmArr-Header': deserializers.header.simple.array(
      deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
      { explode: false, required: false },
    ),
    'X-ObjExpl-Header': deserializers.header.simple.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true, required: true },
    ),
    'X-OptObjExpl-Header': deserializers.header.simple.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: true, required: false },
    ),
    'X-Obj-Header': deserializers.header.simple.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: false, required: true },
    ),
    'X-OptObj-Header': deserializers.header.simple.object(
      {
        str: deserializers.value.string(),
        num: deserializers.value.number(),
        bool: deserializers.value.boolean(),
        enm: deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        optStr: deserializers.value.optional(deserializers.value.string()),
        optNum: deserializers.value.optional(deserializers.value.number()),
        optBool: deserializers.value.optional(deserializers.value.boolean()),
        optEnm: deserializers.value.optional(
          deserializers.value.string(deserializers.value.enumeration<string, CommonEnumType>(['A', 'B', 'C'])),
        ),
      },
      { explode: false, required: false },
    ),
  })

/**
 * Endpoint for testing query parameters with deepObject serialization
 */
export async function deepObjectQueryParameters(
  input: DeepObjectQueryParametersRequest,
  config: ClientConfiguration,
): Promise<DeepObjectQueryParametersResponse> {
  return execute(
    {
      url: joinUrl(
        config.baseUrl,
        '/deepObject-query-parameters',
        deepObjectQueryParametersQuerySerializer(input.query),
      ),
      method: 'get',
    },
    config,
    deepObjectQueryParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing query parameters with form serialization
 */
export async function formQueryParameters(
  input: FormQueryParametersRequest,
  config: ClientConfiguration,
): Promise<FormQueryParametersResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/form-query-parameters', formQueryParametersQuerySerializer(input.query)),
      method: 'get',
    },
    config,
    formQueryParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing path parameters with label serialization
 */
export async function labelPathParameters(
  input: LabelPathParametersRequest,
  config: ClientConfiguration,
): Promise<LabelPathParametersResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, labelPathParametersPathSerializer(input.path)), method: 'get' },
    config,
    labelPathParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing path parameters with matrix serialization
 */
export async function matrixPathParameters(
  input: MatrixPathParametersRequest,
  config: ClientConfiguration,
): Promise<MatrixPathParametersResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, matrixPathParametersPathSerializer(input.path)), method: 'get' },
    config,
    matrixPathParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing query parameters with pipeDelimited serialization
 */
export async function pipeDelimitedQueryParameters(
  input: PipeDelimitedQueryParametersRequest,
  config: ClientConfiguration,
): Promise<PipeDelimitedQueryParametersResponse> {
  return execute(
    {
      url: joinUrl(
        config.baseUrl,
        '/pipeDelimited-query-parameters',
        pipeDelimitedQueryParametersQuerySerializer(input.query),
      ),
      method: 'get',
    },
    config,
    pipeDelimitedQueryParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing header parameters with simple serialization
 */
export async function simpleHeaderParameters(
  input: SimpleHeaderParametersRequest,
  config: ClientConfiguration,
): Promise<SimpleHeaderParametersResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/simple-header-parameters'),
      method: 'get',
      headers: simpleHeaderParametersRequestHeadersSerializer(input.headers),
    },
    config,
    simpleHeaderParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing path parameters with simple serialization
 */
export async function simplePathParameters(
  input: SimplePathParametersRequest,
  config: ClientConfiguration,
): Promise<SimplePathParametersResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, simplePathParametersPathSerializer(input.path)), method: 'get' },
    config,
    simplePathParametersResponseBodyValidator,
  )
}

/**
 * Endpoint for testing query parameters with spaceDelimited serialization
 */
export async function spaceDelimitedQueryParameters(
  input: SpaceDelimitedQueryParametersRequest,
  config: ClientConfiguration,
): Promise<SpaceDelimitedQueryParametersResponse> {
  return execute(
    {
      url: joinUrl(
        config.baseUrl,
        '/spaceDelimited-query-parameters',
        spaceDelimitedQueryParametersQuerySerializer(input.query),
      ),
      method: 'get',
    },
    config,
    spaceDelimitedQueryParametersResponseBodyValidator,
  )
}

export type ParametersSdk = {
  /**
   * Endpoint for testing query parameters with deepObject serialization
   */
  deepObjectQueryParameters(
    input: DeepObjectQueryParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<DeepObjectQueryParametersResponse>
  /**
   * Endpoint for testing query parameters with form serialization
   */
  formQueryParameters(
    input: FormQueryParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<FormQueryParametersResponse>
  /**
   * Endpoint for testing path parameters with label serialization
   */
  labelPathParameters(
    input: LabelPathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<LabelPathParametersResponse>
  /**
   * Endpoint for testing path parameters with matrix serialization
   */
  matrixPathParameters(
    input: MatrixPathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<MatrixPathParametersResponse>
  /**
   * Endpoint for testing query parameters with pipeDelimited serialization
   */
  pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<PipeDelimitedQueryParametersResponse>
  /**
   * Endpoint for testing header parameters with simple serialization
   */
  simpleHeaderParameters(
    input: SimpleHeaderParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<SimpleHeaderParametersResponse>
  /**
   * Endpoint for testing path parameters with simple serialization
   */
  simplePathParameters(
    input: SimplePathParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<SimplePathParametersResponse>
  /**
   * Endpoint for testing query parameters with spaceDelimited serialization
   */
  spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersRequest,
    config?: Partial<ClientConfiguration>,
  ): Promise<SpaceDelimitedQueryParametersResponse>
}

export class ParametersClientSdk implements ParametersSdk {
  protected readonly config: ClientConfiguration
  public constructor(config: ClientConfiguration) {
    this.config = config
  }
  public async deepObjectQueryParameters(
    input: DeepObjectQueryParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<DeepObjectQueryParametersResponse> {
    return deepObjectQueryParameters(input, { ...this.config, ...config })
  }
  public async formQueryParameters(
    input: FormQueryParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<FormQueryParametersResponse> {
    return formQueryParameters(input, { ...this.config, ...config })
  }
  public async labelPathParameters(
    input: LabelPathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<LabelPathParametersResponse> {
    return labelPathParameters(input, { ...this.config, ...config })
  }
  public async matrixPathParameters(
    input: MatrixPathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<MatrixPathParametersResponse> {
    return matrixPathParameters(input, { ...this.config, ...config })
  }
  public async pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<PipeDelimitedQueryParametersResponse> {
    return pipeDelimitedQueryParameters(input, { ...this.config, ...config })
  }
  public async simpleHeaderParameters(
    input: SimpleHeaderParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<SimpleHeaderParametersResponse> {
    return simpleHeaderParameters(input, { ...this.config, ...config })
  }
  public async simplePathParameters(
    input: SimplePathParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<SimplePathParametersResponse> {
    return simplePathParameters(input, { ...this.config, ...config })
  }
  public async spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersRequest,
    config: Partial<ClientConfiguration> = {},
  ): Promise<SpaceDelimitedQueryParametersResponse> {
    return spaceDelimitedQueryParameters(input, { ...this.config, ...config })
  }
}

export class ParametersSdkStub implements ParametersSdk {
  public async deepObjectQueryParameters(
    _input: DeepObjectQueryParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<DeepObjectQueryParametersResponse> {
    throw new Error(
      'Stub method "deepObjectQueryParameters" called. You should implement this method if you want to use it.',
    )
  }
  public async formQueryParameters(
    _input: FormQueryParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<FormQueryParametersResponse> {
    throw new Error('Stub method "formQueryParameters" called. You should implement this method if you want to use it.')
  }
  public async labelPathParameters(
    _input: LabelPathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<LabelPathParametersResponse> {
    throw new Error('Stub method "labelPathParameters" called. You should implement this method if you want to use it.')
  }
  public async matrixPathParameters(
    _input: MatrixPathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<MatrixPathParametersResponse> {
    throw new Error(
      'Stub method "matrixPathParameters" called. You should implement this method if you want to use it.',
    )
  }
  public async pipeDelimitedQueryParameters(
    _input: PipeDelimitedQueryParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<PipeDelimitedQueryParametersResponse> {
    throw new Error(
      'Stub method "pipeDelimitedQueryParameters" called. You should implement this method if you want to use it.',
    )
  }
  public async simpleHeaderParameters(
    _input: SimpleHeaderParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<SimpleHeaderParametersResponse> {
    throw new Error(
      'Stub method "simpleHeaderParameters" called. You should implement this method if you want to use it.',
    )
  }
  public async simplePathParameters(
    _input: SimplePathParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<SimplePathParametersResponse> {
    throw new Error(
      'Stub method "simplePathParameters" called. You should implement this method if you want to use it.',
    )
  }
  public async spaceDelimitedQueryParameters(
    _input: SpaceDelimitedQueryParametersRequest,
    _config: Partial<ClientConfiguration> = {},
  ): Promise<SpaceDelimitedQueryParametersResponse> {
    throw new Error(
      'Stub method "spaceDelimitedQueryParameters" called. You should implement this method if you want to use it.',
    )
  }
}

export type ParametersApi<T> = {
  /**
   * Endpoint for testing query parameters with deepObject serialization
   */
  deepObjectQueryParameters(
    input: DeepObjectQueryParametersServerRequest,
    extra: T,
  ): Promise<DeepObjectQueryParametersResponse>
  /**
   * Endpoint for testing query parameters with form serialization
   */
  formQueryParameters(input: FormQueryParametersServerRequest, extra: T): Promise<FormQueryParametersResponse>
  /**
   * Endpoint for testing path parameters with label serialization
   */
  labelPathParameters(input: LabelPathParametersServerRequest, extra: T): Promise<LabelPathParametersResponse>
  /**
   * Endpoint for testing path parameters with matrix serialization
   */
  matrixPathParameters(input: MatrixPathParametersServerRequest, extra: T): Promise<MatrixPathParametersResponse>
  /**
   * Endpoint for testing query parameters with pipeDelimited serialization
   */
  pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersServerRequest,
    extra: T,
  ): Promise<PipeDelimitedQueryParametersResponse>
  /**
   * Endpoint for testing header parameters with simple serialization
   */
  simpleHeaderParameters(input: SimpleHeaderParametersServerRequest, extra: T): Promise<SimpleHeaderParametersResponse>
  /**
   * Endpoint for testing path parameters with simple serialization
   */
  simplePathParameters(input: SimplePathParametersServerRequest, extra: T): Promise<SimplePathParametersResponse>
  /**
   * Endpoint for testing query parameters with spaceDelimited serialization
   */
  spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersServerRequest,
    extra: T,
  ): Promise<SpaceDelimitedQueryParametersResponse>
}

export const deepObjectQueryParametersRoute: Router = Router().get(
  '/deepObject-query-parameters',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [queryIssues, query] = await configuration.getQueryParameters(
      frameworkInput,
      deepObjectQueryParametersQueryDeserializer,
    )
    const issues = [...queryIssues]
    const typedRequest = {
      query,
      issues: issues.length > 0 ? issues : undefined,
    } as DeepObjectQueryParametersServerRequest
    const typedResponse = await api.deepObjectQueryParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const formQueryParametersRoute: Router = Router().get(
  '/form-query-parameters',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [queryIssues, query] = await configuration.getQueryParameters(
      frameworkInput,
      formQueryParametersQueryDeserializer,
    )
    const issues = [...queryIssues]
    const typedRequest = {
      query,
      issues: issues.length > 0 ? issues : undefined,
    } as FormQueryParametersServerRequest
    const typedResponse = await api.formQueryParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const labelPathParametersRoute: Router = Router().get(
  '/label-path-parameters/:strExpl/:str/:numExpl/:num/:boolExpl/:bool/:enmExpl/:enm/:strArrExpl/:strArr/:numArrExpl/:numArr/:boolArrExpl/:boolArr/:enmArrExpl/:enmArr/:objExpl/:obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = await configuration.getPathParameters(
      frameworkInput,
      labelPathParametersPathDeserializer,
    )
    const issues = [...pathIssues]
    const typedRequest = {
      path,
      issues: issues.length > 0 ? issues : undefined,
    } as LabelPathParametersServerRequest
    const typedResponse = await api.labelPathParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const matrixPathParametersRoute: Router = Router().get(
  '/matrix-path-parameters/:strExpl/:str/:numExpl/:num/:boolExpl/:bool/:enmExpl/:enm/:strArrExpl/:strArr/:numArrExpl/:numArr/:boolArrExpl/:boolArr/:enmArrExpl/:enmArr/:objExpl/:obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = await configuration.getPathParameters(
      frameworkInput,
      matrixPathParametersPathDeserializer,
    )
    const issues = [...pathIssues]
    const typedRequest = {
      path,
      issues: issues.length > 0 ? issues : undefined,
    } as MatrixPathParametersServerRequest
    const typedResponse = await api.matrixPathParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const pipeDelimitedQueryParametersRoute: Router = Router().get(
  '/pipeDelimited-query-parameters',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [queryIssues, query] = await configuration.getQueryParameters(
      frameworkInput,
      pipeDelimitedQueryParametersQueryDeserializer,
    )
    const issues = [...queryIssues]
    const typedRequest = {
      query,
      issues: issues.length > 0 ? issues : undefined,
    } as PipeDelimitedQueryParametersServerRequest
    const typedResponse = await api.pipeDelimitedQueryParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const simpleHeaderParametersRoute: Router = Router().get(
  '/simple-header-parameters',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [headerIssues, headers] = await configuration.getRequestHeaders(
      frameworkInput,
      simpleHeaderParametersRequestHeadersDeserializer,
    )
    const issues = [...headerIssues]
    const typedRequest = {
      headers,
      issues: issues.length > 0 ? issues : undefined,
    } as SimpleHeaderParametersServerRequest
    const typedResponse = await api.simpleHeaderParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const simplePathParametersRoute: Router = Router().get(
  '/simple-path-parameters/:strExpl/:str/:numExpl/:num/:boolExpl/:bool/:enmExpl/:enm/:strArrExpl/:strArr/:numArrExpl/:numArr/:boolArrExpl/:boolArr/:enmArrExpl/:enmArr/:objExpl/:obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = await configuration.getPathParameters(
      frameworkInput,
      simplePathParametersPathDeserializer,
    )
    const issues = [...pathIssues]
    const typedRequest = {
      path,
      issues: issues.length > 0 ? issues : undefined,
    } as SimplePathParametersServerRequest
    const typedResponse = await api.simplePathParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const spaceDelimitedQueryParametersRoute: Router = Router().get(
  '/spaceDelimited-query-parameters',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: ParametersApi<ExpressParameters> = response.locals['__oats_api']
    const [queryIssues, query] = await configuration.getQueryParameters(
      frameworkInput,
      spaceDelimitedQueryParametersQueryDeserializer,
    )
    const issues = [...queryIssues]
    const typedRequest = {
      query,
      issues: issues.length > 0 ? issues : undefined,
    } as SpaceDelimitedQueryParametersServerRequest
    const typedResponse = await api.spaceDelimitedQueryParameters(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export type ParametersRoutes = {
  deepObjectQueryParametersRoute: Router
  formQueryParametersRoute: Router
  labelPathParametersRoute: Router
  matrixPathParametersRoute: Router
  pipeDelimitedQueryParametersRoute: Router
  simpleHeaderParametersRoute: Router
  simplePathParametersRoute: Router
  spaceDelimitedQueryParametersRoute: Router
}

export function createParametersMainRoute(
  api: ParametersApi<ExpressParameters>,
  configuration: ServerConfiguration<ExpressParameters>,
  routes: Partial<ParametersRoutes> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_configuration'] = configuration
      next()
    },
    routes.deepObjectQueryParametersRoute ?? deepObjectQueryParametersRoute,
    routes.formQueryParametersRoute ?? formQueryParametersRoute,
    routes.labelPathParametersRoute ?? labelPathParametersRoute,
    routes.matrixPathParametersRoute ?? matrixPathParametersRoute,
    routes.pipeDelimitedQueryParametersRoute ?? pipeDelimitedQueryParametersRoute,
    routes.simpleHeaderParametersRoute ?? simpleHeaderParametersRoute,
    routes.simplePathParametersRoute ?? simplePathParametersRoute,
    routes.spaceDelimitedQueryParametersRoute ?? spaceDelimitedQueryParametersRoute,
  )
}