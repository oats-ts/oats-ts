import { RawHttpResponse } from '@oats-ts/openapi-http'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithQueryParamsQueryDeserializer } from '../queryDeserializers/getWithQueryParamsQueryDeserializer'
import { GetWithQueryParamsServerRequest } from '../requestServerTypes/GetWithQueryParamsServerRequest'

export const getWithQueryParamsRoute: Router = Router().get(
  '/query-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [queryIssues, query] = await configuration.getQueryParameters(
      frameworkInput,
      getWithQueryParamsQueryDeserializer,
    )
    const issues = [...queryIssues]
    const typedRequest = {
      query,
      issues: issues.length > 0 ? issues : undefined,
    } as GetWithQueryParamsServerRequest
    const typedResponse = await api.getWithQueryParams(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)
