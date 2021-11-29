import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { Issue } from '@oats-ts/validators'
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

type ParameterResponse<T> =
  | HttpResponse<T, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export class ParametersApiImpl implements ParametersApi<ExpressParameters> {
  private respond<T>(params?: T, issues?: Issue[]): ParameterResponse<T> {
    if (issues) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        headers: undefined,
        body: issues.map((issue) => ({ message: issue.message })),
      }
    }
    if (params) {
      return {
        mimeType: 'application/json',
        statusCode: 200,
        headers: undefined,
        body: params,
      }
    }
    throw new TypeError('something wrong')
  }
  async simpleResponseHeaderParameters(
    input: SimpleResponseHeaderParametersServerRequest,
  ): Promise<SimpleResponseHeaderParametersResponse> {
    if (input.issues) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        headers: undefined,
        body: input.issues.map((issue) => ({ message: issue.message })),
      }
    }
    return {
      body: { ok: true },
      headers: input.body,
      mimeType: 'application/json',
      statusCode: 200,
    }
  }
  async deepObjectQueryParameters(
    input: DeepObjectQueryParametersServerRequest,
  ): Promise<DeepObjectQueryParametersResponse> {
    return this.respond(input.query, input.issues)
  }
  async formQueryParameters(input: FormQueryParametersServerRequest): Promise<FormQueryParametersResponse> {
    return this.respond(input.query, input.issues)
  }
  async labelPathParameters(input: LabelPathParametersServerRequest): Promise<LabelPathParametersResponse> {
    return this.respond(input.path, input.issues)
  }
  async matrixPathParameters(input: MatrixPathParametersServerRequest): Promise<MatrixPathParametersResponse> {
    return this.respond(input.path, input.issues)
  }
  async pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersServerRequest,
  ): Promise<PipeDelimitedQueryParametersResponse> {
    return this.respond(input.query, input.issues)
  }
  async simpleHeaderParameters(input: SimpleHeaderParametersServerRequest): Promise<SimpleHeaderParametersResponse> {
    return this.respond(input.headers, input.issues)
  }
  async simplePathParameters(input: SimplePathParametersServerRequest): Promise<SimplePathParametersResponse> {
    return this.respond(input.path, input.issues)
  }
  async spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersServerRequest,
  ): Promise<SpaceDelimitedQueryParametersResponse> {
    return this.respond(input.query, input.issues)
  }
}
