import { HasRequestBody, HttpResponse } from '@oats-ts/openapi-http'
import { isFailure, Try } from '@oats-ts/try'
import { BodiesApi } from '../../generated/bodies/apiType'
import {
  StrServerRequest,
  NumServerRequest,
  EnmServerRequest,
  BoolServerRequest,
  PrimTupleServerRequest,
  OptPrimTupleServerRequest,
  StrArrServerRequest,
  NumArrServerRequest,
  EnmArrServerRequest,
  BoolArrServerRequest,
  PrimObjServerRequest,
  ArrObjServerRequest,
  NestedObjServerRequest,
} from '../../generated/bodies/requestServerTypes'
import {
  StrServerResponse,
  NumServerResponse,
  EnmServerResponse,
  BoolServerResponse,
  PrimTupleServerResponse,
  OptPrimTupleServerResponse,
  StrArrServerResponse,
  NumArrServerResponse,
  EnmArrServerResponse,
  BoolArrServerResponse,
  PrimObjServerResponse,
  ArrObjServerResponse,
  NestedObjServerResponse,
} from '../../generated/bodies/responseServerTypes'

export class BodiesApiImpl implements BodiesApi {
  async respond(request: HasRequestBody<any, Try<any>>): Promise<HttpResponse<any, 200, any, undefined>> {
    if (isFailure(request.body)) {
      console.error(request.body.issues)
      throw new TypeError(JSON.stringify(request.body.issues))
    }
    return {
      body: request.body.data,
      headers: undefined,
      mimeType: request.mimeType,
      statusCode: 200,
    }
  }
  async optPrimTuple(request: OptPrimTupleServerRequest): Promise<OptPrimTupleServerResponse> {
    return this.respond(request)
  }
  async primTuple(request: PrimTupleServerRequest): Promise<PrimTupleServerResponse> {
    return this.respond(request)
  }
  async arrObj(request: ArrObjServerRequest): Promise<ArrObjServerResponse> {
    return this.respond(request)
  }
  async bool(request: BoolServerRequest): Promise<BoolServerResponse> {
    return this.respond(request)
  }
  async boolArr(request: BoolArrServerRequest): Promise<BoolArrServerResponse> {
    return this.respond(request)
  }
  async enm(request: EnmServerRequest): Promise<EnmServerResponse> {
    return this.respond(request)
  }
  async enmArr(request: EnmArrServerRequest): Promise<EnmArrServerResponse> {
    return this.respond(request)
  }
  async nestedObj(request: NestedObjServerRequest): Promise<NestedObjServerResponse> {
    return this.respond(request)
  }
  async num(request: NumServerRequest): Promise<NumServerResponse> {
    return this.respond(request)
  }
  async numArr(request: NumArrServerRequest): Promise<NumArrServerResponse> {
    return this.respond(request)
  }
  async primObj(request: PrimObjServerRequest): Promise<PrimObjServerResponse> {
    return this.respond(request)
  }
  async str(request: StrServerRequest): Promise<StrServerResponse> {
    return this.respond(request)
  }
  async strArr(request: StrArrServerRequest): Promise<StrArrServerResponse> {
    return this.respond(request)
  }
}
