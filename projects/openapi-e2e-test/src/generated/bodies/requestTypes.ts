/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/bodies.json (originating from oats-ts/oats-schemas)
 */

import {
  EnumType,
  ObjectWithArrays,
  ObjectWithNestedObjects,
  ObjectWithNullablePrimitives,
  ObjectWithPrimitives,
  PrimitiveOptionalTupleType,
  PrimitiveTupleType,
} from './types'

export type ArrObjRequest =
  | {
      mimeType: 'application/json'
      body: ObjectWithArrays
    }
  | {
      mimeType: 'application/yaml'
      body: ObjectWithArrays
    }

export type BoolArrRequest =
  | {
      mimeType: 'application/json'
      body: boolean[]
    }
  | {
      mimeType: 'application/yaml'
      body: boolean[]
    }

export type BoolRequest =
  | {
      mimeType: 'application/json'
      body: boolean
    }
  | {
      mimeType: 'application/yaml'
      body: boolean
    }

export type EnmArrRequest =
  | {
      mimeType: 'application/json'
      body: EnumType[]
    }
  | {
      mimeType: 'application/yaml'
      body: EnumType[]
    }

export type EnmRequest =
  | {
      mimeType: 'application/json'
      body: EnumType
    }
  | {
      mimeType: 'application/yaml'
      body: EnumType
    }

export type NestedObjRequest =
  | {
      mimeType: 'application/json'
      body: ObjectWithNestedObjects
    }
  | {
      mimeType: 'application/yaml'
      body: ObjectWithNestedObjects
    }

export type NullablePrimObjRequest =
  | {
      mimeType: 'application/json'
      body: ObjectWithNullablePrimitives
    }
  | {
      mimeType: 'application/yaml'
      body: ObjectWithNullablePrimitives
    }

export type NumArrRequest =
  | {
      mimeType: 'application/json'
      body: number[]
    }
  | {
      mimeType: 'application/yaml'
      body: number[]
    }

export type NumRequest =
  | {
      mimeType: 'application/json'
      body: number
    }
  | {
      mimeType: 'application/yaml'
      body: number
    }

export type OptPrimTupleRequest =
  | {
      mimeType: 'application/json'
      body: PrimitiveOptionalTupleType
    }
  | {
      mimeType: 'application/yaml'
      body: PrimitiveOptionalTupleType
    }

export type PrimObjRequest =
  | {
      mimeType: 'application/json'
      body: ObjectWithPrimitives
    }
  | {
      mimeType: 'application/yaml'
      body: ObjectWithPrimitives
    }

export type PrimTupleRequest =
  | {
      mimeType: 'application/json'
      body: PrimitiveTupleType
    }
  | {
      mimeType: 'application/yaml'
      body: PrimitiveTupleType
    }

export type StrArrRequest =
  | {
      mimeType: 'application/json'
      body: string[]
    }
  | {
      mimeType: 'application/yaml'
      body: string[]
    }

export type StrRequest =
  | {
      mimeType: 'application/json'
      body: string
    }
  | {
      mimeType: 'application/yaml'
      body: string
    }
