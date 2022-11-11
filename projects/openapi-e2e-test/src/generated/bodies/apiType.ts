/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/bodies.json (originating from oats-ts/oats-schemas)
 */

import {
  ArrObjServerRequest,
  BoolArrServerRequest,
  BoolServerRequest,
  EnmArrServerRequest,
  EnmServerRequest,
  NestedObjServerRequest,
  NumArrServerRequest,
  NumServerRequest,
  OptPrimTupleServerRequest,
  PrimObjServerRequest,
  PrimTupleServerRequest,
  StrArrServerRequest,
  StrServerRequest,
} from './requestServerTypes'
import {
  ArrObjServerResponse,
  BoolArrServerResponse,
  BoolServerResponse,
  EnmArrServerResponse,
  EnmServerResponse,
  NestedObjServerResponse,
  NumArrServerResponse,
  NumServerResponse,
  OptPrimTupleServerResponse,
  PrimObjServerResponse,
  PrimTupleServerResponse,
  StrArrServerResponse,
  StrServerResponse,
} from './responseServerTypes'

export type BodiesApi = {
  str(request: StrServerRequest): Promise<StrServerResponse>
  num(request: NumServerRequest): Promise<NumServerResponse>
  enm(request: EnmServerRequest): Promise<EnmServerResponse>
  bool(request: BoolServerRequest): Promise<BoolServerResponse>
  primTuple(request: PrimTupleServerRequest): Promise<PrimTupleServerResponse>
  optPrimTuple(request: OptPrimTupleServerRequest): Promise<OptPrimTupleServerResponse>
  strArr(request: StrArrServerRequest): Promise<StrArrServerResponse>
  numArr(request: NumArrServerRequest): Promise<NumArrServerResponse>
  enmArr(request: EnmArrServerRequest): Promise<EnmArrServerResponse>
  boolArr(request: BoolArrServerRequest): Promise<BoolArrServerResponse>
  primObj(request: PrimObjServerRequest): Promise<PrimObjServerResponse>
  arrObj(request: ArrObjServerRequest): Promise<ArrObjServerResponse>
  nestedObj(request: NestedObjServerRequest): Promise<NestedObjServerResponse>
}
