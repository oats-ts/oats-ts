import { isFailure, Try } from '@oats-ts/try'
import { HttpResponse, SetCookieValue } from '@oats-ts/openapi-http'
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
import { defaultCookies } from './parameters.testdata'
import {
  DeepObjectQueryParametersQueryParameters,
  FormQueryParametersQueryParameters,
  PipeDelimitedQueryParametersQueryParameters,
  SpaceDelimitedQueryParametersQueryParameters,
} from '../../generated/parameters/queryTypes'
import {
  LabelPathParametersPathParameters,
  MatrixPathParametersPathParameters,
  SimplePathParametersPathParameters,
} from '../../generated/parameters/pathTypes'
import { SimpleHeaderParametersRequestHeaderParameters } from '../../generated/parameters/requestHeaderTypes'

type ParameterResponse<T> =
  | HttpResponse<T, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export class ParametersApiImpl implements ParametersApi {
  private respond<T, R extends ParameterResponse<T>>(params: Try<T>): R {
    if (isFailure(params)) {
      return {
        mimeType: 'application/json',
        statusCode: 400,
        body: params.issues.map((issue) => ({ message: issue.message })),
      } as R
    }
    return {
      mimeType: 'application/json',
      statusCode: 200,
      body: params.data,
    } as R
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
    return this.respond<DeepObjectQueryParametersQueryParameters, DeepObjectQueryParametersServerResponse>(input.query)
  }
  async formQueryParameters(input: FormQueryParametersServerRequest): Promise<FormQueryParametersServerResponse> {
    return this.respond<FormQueryParametersQueryParameters, FormQueryParametersServerResponse>(input.query)
  }
  async labelPathParameters(input: LabelPathParametersServerRequest): Promise<LabelPathParametersServerResponse> {
    return this.respond<LabelPathParametersPathParameters, LabelPathParametersServerResponse>(input.path)
  }
  async matrixPathParameters(input: MatrixPathParametersServerRequest): Promise<MatrixPathParametersServerResponse> {
    return this.respond<MatrixPathParametersPathParameters, MatrixPathParametersServerResponse>(input.path)
  }
  async pipeDelimitedQueryParameters(
    input: PipeDelimitedQueryParametersServerRequest,
  ): Promise<PipeDelimitedQueryParametersServerResponse> {
    return this.respond<PipeDelimitedQueryParametersQueryParameters, PipeDelimitedQueryParametersServerResponse>(
      input.query,
    )
  }
  async simpleHeaderParameters(
    input: SimpleHeaderParametersServerRequest,
  ): Promise<SimpleHeaderParametersServerResponse> {
    return this.respond<SimpleHeaderParametersRequestHeaderParameters, SimpleHeaderParametersServerResponse>(
      input.headers,
    )
  }
  async simplePathParameters(input: SimplePathParametersServerRequest): Promise<SimplePathParametersServerResponse> {
    return this.respond<SimplePathParametersPathParameters, SimplePathParametersServerResponse>(input.path)
  }
  async spaceDelimitedQueryParameters(
    input: SpaceDelimitedQueryParametersServerRequest,
  ): Promise<SpaceDelimitedQueryParametersServerResponse> {
    return this.respond<SpaceDelimitedQueryParametersQueryParameters, SpaceDelimitedQueryParametersServerResponse>(
      input.query,
    )
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
    const cookies: SetCookieValue[] = [
      {
        name: 'optBool',
        value: (data.optBool ?? defaultCookies.optBool ?? true).toString(),
      },
      {
        name: 'optNum',
        value: (data.optNum ?? defaultCookies.optNum ?? 42).toString(),
        expires: new Date().toUTCString(),
      },
      {
        name: 'optEnm',
        value: (data.optEnm ?? defaultCookies.optEnm ?? 'A').toString(),
        sameSite: 'Lax',
      },
      {
        name: 'optStr',
        value: (data.optStr ?? defaultCookies.optStr ?? 'default').toString(),
        maxAge: 100,
      },
    ]

    return {
      body: data,
      mimeType: 'application/json',
      statusCode: 200,
      cookies,
    }
  }
}
