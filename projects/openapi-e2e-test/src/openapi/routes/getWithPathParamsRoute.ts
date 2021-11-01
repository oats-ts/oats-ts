import { RawHttpResponse } from '@oats-ts/openapi-http'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithPathParamsPathDeserializer } from '../pathDeserializers/getWithPathParamsPathDeserializer'
import { GetWithPathParamsServerRequest } from '../requestServerTypes/GetWithPathParamsServerRequest'

export const getWithPathParamsRoute: Router = Router().get(
  '/path-params/:stringInPath/:numberInPath/:booleanInPath/:enumInPath/:objectInPath/:arrayInPath',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = await configuration.getPathParameters(frameworkInput, getWithPathParamsPathDeserializer)
    const issues = [...pathIssues]
    const typedRequest = {
      path,
      issues: issues.length > 0 ? issues : undefined,
    } as GetWithPathParamsServerRequest
    const typedResponse = await api.getWithPathParams(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)
