import { HasRequestBody, HttpResponse } from '@oats-ts/openapi-http'
import { isFailure, Try } from '@oats-ts/try'
import {
  ArrObjResponse,
  ArrObjServerRequest,
  BodiesApi,
  BoolArrResponse,
  BoolArrServerRequest,
  BoolResponse,
  BoolServerRequest,
  EnmArrResponse,
  EnmArrServerRequest,
  EnmResponse,
  EnmServerRequest,
  NestedObjResponse,
  NestedObjServerRequest,
  NumArrResponse,
  NumArrServerRequest,
  NumResponse,
  NumServerRequest,
  OptPrimTupleResponse,
  OptPrimTupleServerRequest,
  PrimObjResponse,
  PrimObjServerRequest,
  PrimTupleResponse,
  PrimTupleServerRequest,
  StrArrResponse,
  StrArrServerRequest,
  StrResponse,
  StrServerRequest,
} from '../../generated/bodies'

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
  async optPrimTuple(request: OptPrimTupleServerRequest): Promise<OptPrimTupleResponse> {
    return this.respond(request)
  }
  async primTuple(request: PrimTupleServerRequest): Promise<PrimTupleResponse> {
    return this.respond(request)
  }
  async arrObj(request: ArrObjServerRequest): Promise<ArrObjResponse> {
    return this.respond(request)
  }
  async bool(request: BoolServerRequest): Promise<BoolResponse> {
    return this.respond(request)
  }
  async boolArr(request: BoolArrServerRequest): Promise<BoolArrResponse> {
    return this.respond(request)
  }
  async enm(request: EnmServerRequest): Promise<EnmResponse> {
    return this.respond(request)
  }
  async enmArr(request: EnmArrServerRequest): Promise<EnmArrResponse> {
    return this.respond(request)
  }
  async nestedObj(request: NestedObjServerRequest): Promise<NestedObjResponse> {
    return this.respond(request)
  }
  async num(request: NumServerRequest): Promise<NumResponse> {
    return this.respond(request)
  }
  async numArr(request: NumArrServerRequest): Promise<NumArrResponse> {
    return this.respond(request)
  }
  async primObj(request: PrimObjServerRequest): Promise<PrimObjResponse> {
    return this.respond(request)
  }
  async str(request: StrServerRequest): Promise<StrResponse> {
    return this.respond(request)
  }
  async strArr(request: StrArrServerRequest): Promise<StrArrResponse> {
    return this.respond(request)
  }
}
