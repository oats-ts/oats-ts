import { isFailure, Try } from '@oats-ts/try'
import { HttpResponse } from '@oats-ts/openapi-http'
import { ParameterIssue } from '../../generated/parameters/types'
import { ParametersApi } from '../../generated/parameters/apiType'
import {
  SimplePathParametersServerRequest,
  LabelPathParametersServerRequest,
  MatrixPathParametersServerRequest,
  FormQueryParametersServerRequest,
  SpaceDelimitedQueryParametersServerRequest,
  PipeDelimitedQueryParametersServerRequest,
  DeepObjectQueryParametersServerRequest,
  SimpleHeaderParametersServerRequest,
  FormCookieParametersServerRequest,
  SimpleResponseHeaderParametersServerRequest,
} from '../../generated/parameters/requestServerTypes'
import {
  SimplePathParametersServerResponse,
  LabelPathParametersServerResponse,
  MatrixPathParametersServerResponse,
  FormQueryParametersServerResponse,
  SpaceDelimitedQueryParametersServerResponse,
  PipeDelimitedQueryParametersServerResponse,
  DeepObjectQueryParametersServerResponse,
  SimpleHeaderParametersServerResponse,
  FormCookieParametersServerResponse,
  SimpleResponseHeaderParametersServerResponse,
} from '../../generated/parameters/responseServerTypes'

type ParameterResponse<T> =
  | HttpResponse<T, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export class ParametersApiImpl implements ParametersApi {
  private respond<T>(params: Try<T>): ParameterResponse<T> {
    if (isFailure(params)) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        body: params.issues.map((issue) => ({ message: issue.message })),
      }
    }
    return {
      mimeType: 'application/json',
      statusCode: 200,
      body: params.data,
    }
  }
  async simpleResponseHeaderParameters(
    input: SimpleResponseHeaderParametersServerRequest,
  ): Promise<SimpleResponseHeaderParametersServerResponse> {
    if (isFailure(input.body)) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        body: input.body.issues.map((issue) => ({ message: issue.message })),
      }
    }
    return {
      body: { ok: true },
      headers: input.body.data,
      mimeType: 'application/json',
      statusCode: 200,
    }
  }
  async deepObjectQueryParameters(
    input: DeepObjectQueryParametersServerRequest,
  ): Promise<DeepObjectQueryParametersServerResponse> {
    return this.respond(input.query)
  }
  async formQueryParameters(input: FormQueryParametersServerRequest): Promise<FormQueryParametersServerResponse> {
    return this.respond(input.query)
  }
  async labelPathParameters(input: LabelPathParametersServerRequest): Promise<LabelPathParametersServerResponse> {
    return this.respond(input.path)
  }
  async matrixPathParameters(input: MatrixPathParametersServerRequest): Promise<MatrixPathParametersServerResponse> {
    return this.respond(input.path)
  }
  async pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersServerRequest,
  ): Promise<PipeDelimitedQueryParametersServerResponse> {
    return this.respond(input.query)
  }
  async simpleHeaderParameters(
    input: SimpleHeaderParametersServerRequest,
  ): Promise<SimpleHeaderParametersServerResponse> {
    return this.respond(input.headers)
  }
  async simplePathParameters(input: SimplePathParametersServerRequest): Promise<SimplePathParametersServerResponse> {
    return this.respond(input.path)
  }
  async spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersServerRequest,
  ): Promise<SpaceDelimitedQueryParametersServerResponse> {
    return this.respond(input.query)
  }
  async formCookieParameters(request: FormCookieParametersServerRequest): Promise<FormCookieParametersServerResponse> {
    if (isFailure(request.cookies)) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        body: request.cookies.issues.map((issue) => ({ message: issue.message })),
      }
    }
    const { data } = request.cookies
    return {
      body: data,
      mimeType: 'application/json',
      statusCode: 200,
      cookies: {
        optBool: { value: data.optBool },
        optNum: { value: data.optNum, expires: new Date().toUTCString(), sameSite: 'Lax' },
        optEnm: { value: data.optEnm, sameSite: 'Strict', path: '/foo' },
        optStr: { value: data.optStr, maxAge: 100, domain: 'http://localhost:8000/foo', httpOnly: true },
      },
    }
  }
}
