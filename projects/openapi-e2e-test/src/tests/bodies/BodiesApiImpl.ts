import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { HasRequestBody, HttpResponse } from '@oats-ts/openapi-http'
import { isFailure, Try, fluent } from '@oats-ts/try'
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

export class BodiesApiImpl implements BodiesApi<ExpressToolkit> {
  // TODO typings
  async respond(input: HasRequestBody<any, Try<any>>): Promise<HttpResponse<any, 200, any, undefined>> {
    if (isFailure(input.body)) {
      const issues = fluent(input.body).getIssues()
      console.error(issues)
      throw new TypeError(JSON.stringify(issues))
    }
    return {
      body: fluent(input.body).getData(),
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
