import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'

export const getWithMultipleResponsesRoute: Router = Router().get(
  '/multiple-responses',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const expressParams: ExpressParameters = { request, response, next }
    const issues = []
    const handlerResults = await api.getWithMultipleResponses(expressParams)
    const responseHeaders = await configuration.getResponseHeaders(handlerResults.headers, undefined)
    await configuration.setStatusCode(response, handlerResults.statusCode)
    await configuration.setResponseHeaders(response, responseHeaders)
  },
)
