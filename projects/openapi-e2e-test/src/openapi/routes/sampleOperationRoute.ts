import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { sampleOperationPathDeserializer } from '../pathDeserializers/sampleOperationPathDeserializer'
import { sampleOperationQueryDeserializer } from '../queryDeserializers/sampleOperationQueryDeserializer'
import { sampleOperationRequestHeadersDeserializer } from '../requestHeaderDeserializers/sampleOperationRequestHeadersDeserializer'

export const sampleOperationRoute: Router = Router().post(
  '/sample/path/:pathParam',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const expressParams: ExpressParameters = { request, response, next }
    const [pathIssues, path] = await configuration.getPathParameters(request, sampleOperationPathDeserializer)
    const [queryIssues, query] = await configuration.getQueryParameters(request, sampleOperationQueryDeserializer)
    const [headerIssues, headers] = await configuration.getRequestHeaders(
      request,
      sampleOperationRequestHeadersDeserializer,
    )
    const [bodyIssues, body, mimeType] = await configuration.getRequestBody(request, undefined)
    const issues = [...pathIssues, ...queryIssues, ...headerIssues, ...bodyIssues]
    const handlerResults = await api.sampleOperation(
      { path, query, headers, mimeType, body, issues: issues.length === 0 ? undefined : issues },
      expressParams,
    )
    const responseHeaders = await configuration.getResponseHeaders(handlerResults.headers, undefined)
    await configuration.setStatusCode(response, handlerResults.statusCode)
    await configuration.setResponseHeaders(response, responseHeaders)
  },
)
