import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { sampleOperationHeadersDeserializer } from '../headerDeserializers/sampleOperationHeadersDeserializer'
import { sampleOperationPathDeserializer } from '../pathDeserializers/sampleOperationPathDeserializer'
import { sampleOperationQueryDeserializer } from '../queryDeserializers/sampleOperationQueryDeserializer'

export const sampleOperationRoute: Router = Router().post(
  '/sample/path/:pathParam',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const expressParameters: ExpressParameters = { request, response, next }
    const [pathIssues, path] = configuration.getPathParameters(request, sampleOperationPathDeserializer)
    const [queryIssues, query] = configuration.getQueryParameters(request, sampleOperationQueryDeserializer)
    const [headerIssues, headers] = configuration.getHeaderParameters(request, sampleOperationHeadersDeserializer)
  },
)
