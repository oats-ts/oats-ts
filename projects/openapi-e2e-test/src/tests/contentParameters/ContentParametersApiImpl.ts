import { isFailure, Try, HttpResponse } from '@oats-ts/openapi-runtime'
import { ContentParametersApi } from '../../generated/content-parameters/apiType'
import { CookieParametersCookieParameters } from '../../generated/content-parameters/cookieTypes'
import { PathParametersPathParameters } from '../../generated/content-parameters/pathTypes'
import { QueryParametersQueryParameters } from '../../generated/content-parameters/queryTypes'
import { HeaderParametersRequestHeaderParameters } from '../../generated/content-parameters/requestHeaderTypes'
import {
  CookieParametersServerRequest,
  HeaderParametersServerRequest,
  PathParametersServerRequest,
  QueryParametersServerRequest,
} from '../../generated/content-parameters/requestServerTypes'
import {
  CookieParametersServerResponse,
  HeaderParametersServerResponse,
  PathParametersServerResponse,
  QueryParametersServerResponse,
} from '../../generated/content-parameters/responseServerTypes'
import { ParameterIssue } from '../../generated/content-parameters/types'

type ParameterResponse<T> =
  | HttpResponse<T, 200, 'application/json', undefined>
  | HttpResponse<ParameterIssue[], 400, 'application/json', undefined>

export class ContentParametersApiImpl implements ContentParametersApi {
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

  async cookieParameters(request: CookieParametersServerRequest): Promise<CookieParametersServerResponse> {
    return this.respond<CookieParametersCookieParameters, CookieParametersServerResponse>(request.cookies)
  }
  async headerParameters(request: HeaderParametersServerRequest): Promise<HeaderParametersServerResponse> {
    return this.respond<HeaderParametersRequestHeaderParameters, HeaderParametersServerResponse>(request.headers)
  }
  async pathParameters(request: PathParametersServerRequest): Promise<PathParametersServerResponse> {
    return this.respond<PathParametersPathParameters, PathParametersServerResponse>(request.path)
  }
  async queryParameters(request: QueryParametersServerRequest): Promise<QueryParametersServerResponse> {
    return this.respond<QueryParametersQueryParameters, QueryParametersServerResponse>(request.query)
  }
}
