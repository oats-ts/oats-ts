import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithHeaderParamsHeadersDeserializer } from '../headerDeserializers/getWithHeaderParamsHeadersDeserializer'

export const getWithHeaderParamsRoute: Router = Router().get(
  '/header-params',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [headerIssues, headers] = configuration.getRequestHeaders(request, getWithHeaderParamsHeadersDeserializer)
    const handlerResults = await api.getWithHeaderParams(
      { headers, issues: [...headerIssues] },
      { request, response, next },
    )
  },
)
