import { RawHttpResponse } from '@oats-ts/openapi-http'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithHeaderParamsRequestHeadersDeserializer } from '../requestHeaderDeserializers/getWithHeaderParamsRequestHeadersDeserializer'
import { GetWithHeaderParamsServerRequest } from '../requestServerTypes/GetWithHeaderParamsServerRequest'

export const getWithHeaderParamsRoute: Router = Router().get(
  '/header-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [headerIssues, headers] = await configuration.getRequestHeaders(
      frameworkInput,
      getWithHeaderParamsRequestHeadersDeserializer,
    )
    const issues = [...headerIssues]
    const typedRequest = {
      headers,
      issues: issues.length > 0 ? issues : undefined,
    } as GetWithHeaderParamsServerRequest
    const typedResponse = await api.getWithHeaderParams(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)
