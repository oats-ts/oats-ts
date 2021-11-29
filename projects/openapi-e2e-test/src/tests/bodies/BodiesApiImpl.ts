import { HasIssues, HasNoIssues, HasRequestBody, HttpResponse } from '@oats-ts/openapi-http'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
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
  PrimObjResponse,
  PrimObjServerRequest,
  StrArrResponse,
  StrArrServerRequest,
  StrResponse,
  StrServerRequest,
} from '../../generated/Bodies'

export class BodiesApiImpl implements BodiesApi<ExpressParameters> {
  // TODO typings
  async respond(
    input: (Partial<HasRequestBody<any, any>> & HasIssues) | (HasRequestBody<any, any> & HasNoIssues),
  ): Promise<HttpResponse<any, 200, any, undefined>> {
    if (input.issues) {
      console.error(input.issues)
      throw new TypeError(JSON.stringify(input.issues))
    }
    return {
      body: input.body as any,
      headers: undefined,
      mimeType: input.mimeType,
      statusCode: 200,
    }
  }
  async arrObj(input: ArrObjServerRequest): Promise<ArrObjResponse> {
    return this.respond(input)
  }
  async bool(input: BoolServerRequest): Promise<BoolResponse> {
    return this.respond(input)
  }
  async boolArr(input: BoolArrServerRequest): Promise<BoolArrResponse> {
    return this.respond(input)
  }
  async enm(input: EnmServerRequest): Promise<EnmResponse> {
    return this.respond(input)
  }
  async enmArr(input: EnmArrServerRequest): Promise<EnmArrResponse> {
    return this.respond(input)
  }
  async nestedObj(input: NestedObjServerRequest): Promise<NestedObjResponse> {
    return this.respond(input)
  }
  async num(input: NumServerRequest): Promise<NumResponse> {
    return this.respond(input)
  }
  async numArr(input: NumArrServerRequest): Promise<NumArrResponse> {
    return this.respond(input)
  }
  async primObj(input: PrimObjServerRequest): Promise<PrimObjResponse> {
    return this.respond(input)
  }
  async str(input: StrServerRequest): Promise<StrResponse> {
    return this.respond(input)
  }
  async strArr(input: StrArrServerRequest): Promise<StrArrResponse> {
    return this.respond(input)
  }
}
