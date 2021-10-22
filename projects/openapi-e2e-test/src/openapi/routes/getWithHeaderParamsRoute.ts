import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithHeaderParamsRequestHeadersDeserializer } from '../requestHeaderDeserializers/getWithHeaderParamsRequestHeadersDeserializer'

export const getWithHeaderParamsRoute: Router = Router().get(
  '/header-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const expressParams: ExpressParameters = { request, response, next }
    const [headerIssues, headers] = await configuration.getRequestHeaders(
      request,
      getWithHeaderParamsRequestHeadersDeserializer,
    )
    const handlerResults = await api.getWithHeaderParams({ headers, issues: [...headerIssues] }, expressParams)
    const responseHeaders = await configuration.getResponseHeaders(handlerResults.headers, undefined)
    await configuration.setStatusCode(response, handlerResults.statusCode)
    await configuration.setResponseHeaders(response, responseHeaders)
  },
)
