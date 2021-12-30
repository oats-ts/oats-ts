import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { HttpResponse } from '@oats-ts/openapi-http-server/node_modules/@oats-ts/openapi-http'
import {
  DeepObjectQueryParametersResponse,
  DeepObjectQueryParametersServerRequest,
  FormQueryParametersResponse,
  FormQueryParametersServerRequest,
  LabelPathParametersResponse,
  LabelPathParametersServerRequest,
  MatrixPathParametersResponse,
  MatrixPathParametersServerRequest,
  ParameterIssue,
  ParametersApi,
  PipeDelimitedQueryParametersResponse,
  PipeDelimitedQueryParametersServerRequest,
  SimpleHeaderParametersResponse,
  SimpleHeaderParametersServerRequest,
  SimplePathParametersResponse,
  SimplePathParametersServerRequest,
  SimpleResponseHeaderParametersResponse,
  SimpleResponseHeaderParametersServerRequest,
  SpaceDelimitedQueryParametersResponse,
  SpaceDelimitedQueryParametersServerRequest,
} from '../../generated/Parameters'
import { get, getIssues, isFailure, Try } from '@oats-ts/try'

type ParameterResponse<T> =
  | HttpResponse<T, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export class ParametersApiImpl implements ParametersApi<ExpressParameters> {
  private respond<T>(params: Try<T>): ParameterResponse<T> {
    if (isFailure(params)) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        headers: undefined,
        body: getIssues(params).map((issue) => ({ message: issue.message })),
      }
    }
    return {
      mimeType: 'application/json',
      statusCode: 200,
      headers: undefined,
      body: get(params),
    }
  }
  async simpleResponseHeaderParameters(
    input: SimpleResponseHeaderParametersServerRequest,
  ): Promise<SimpleResponseHeaderParametersResponse> {
    if (isFailure(input.body)) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        headers: undefined,
        body: getIssues(input.body).map((issue) => ({ message: issue.message })),
      }
    }
    return {
      body: { ok: true },
      headers: get(input.body),
      mimeType: 'application/json',
      statusCode: 200,
    }
  }
  async deepObjectQueryParameters(
    input: DeepObjectQueryParametersServerRequest,
  ): Promise<DeepObjectQueryParametersResponse> {
    return this.respond(input.query)
  }
  async formQueryParameters(input: FormQueryParametersServerRequest): Promise<FormQueryParametersResponse> {
    return this.respond(input.query)
  }
  async labelPathParameters(input: LabelPathParametersServerRequest): Promise<LabelPathParametersResponse> {
    return this.respond(input.path)
  }
  async matrixPathParameters(input: MatrixPathParametersServerRequest): Promise<MatrixPathParametersResponse> {
    return this.respond(input.path)
  }
  async pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersServerRequest,
  ): Promise<PipeDelimitedQueryParametersResponse> {
    return this.respond(input.query)
  }
  async simpleHeaderParameters(input: SimpleHeaderParametersServerRequest): Promise<SimpleHeaderParametersResponse> {
    return this.respond(input.headers)
  }
  async simplePathParameters(input: SimplePathParametersServerRequest): Promise<SimplePathParametersResponse> {
    return this.respond(input.path)
  }
  async spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersServerRequest,
  ): Promise<SpaceDelimitedQueryParametersResponse> {
    return this.respond(input.query)
  }
}
