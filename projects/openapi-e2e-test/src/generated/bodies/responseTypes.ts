/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/bodies.json (originating from oats-ts/oats-schemas)
 */

import {
  EnumType,
  ObjectWithArrays,
  ObjectWithNestedObjects,
  ObjectWithPrimitives,
  PrimitiveOptionalTupleType,
  PrimitiveTupleType,
} from './types'

export type ArrObjResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: ObjectWithArrays
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: ObjectWithArrays
    }

export type BoolArrResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: boolean[]
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: boolean[]
    }

export type BoolResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: boolean
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: boolean
    }

export type EnmArrResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: EnumType[]
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: EnumType[]
    }

export type EnmResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: EnumType
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: EnumType
    }

export type NestedObjResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: ObjectWithNestedObjects
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: ObjectWithNestedObjects
    }

export type NumArrResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: number[]
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: number[]
    }

export type NumResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: number
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: number
    }

export type OptPrimTupleResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: PrimitiveOptionalTupleType
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: PrimitiveOptionalTupleType
    }

export type PrimObjResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: ObjectWithPrimitives
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: ObjectWithPrimitives
    }

export type PrimTupleResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: PrimitiveTupleType
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: PrimitiveTupleType
    }

export type StrArrResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: string[]
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: string[]
    }

export type StrResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: string
    }
  | {
      statusCode: 200
      mimeType: 'application/yaml'
      body: string
    }
