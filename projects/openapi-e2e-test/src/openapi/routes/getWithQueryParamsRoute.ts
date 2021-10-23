import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithQueryParamsQueryDeserializer } from '../queryDeserializers/getWithQueryParamsQueryDeserializer'

export const getWithQueryParamsRoute: Router = Router().get(
  '/query-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const expressParams: ExpressParameters = { request, response, next }
    const [queryIssues, query] = await configuration.getQueryParameters(request, getWithQueryParamsQueryDeserializer)
    const issues = [...queryIssues]
    const handlerResults = await api.getWithQueryParams(
      { query, issues: issues.length === 0 ? undefined : issues },
      expressParams,
    )
    const responseHeaders = await configuration.getResponseHeaders(handlerResults.headers, undefined)
    await configuration.setStatusCode(response, handlerResults.statusCode)
    await configuration.setResponseHeaders(response, responseHeaders)
  },
)
