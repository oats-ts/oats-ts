import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'
import { getWithPathParamsPathDeserializer } from '../pathDeserializers/getWithPathParamsPathDeserializer'

export const getWithPathParamsRoute: Router = Router().get(
  '/path-params/:stringInPath/:numberInPath/:booleanInPath/:enumInPath/:objectInPath/:arrayInPath',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [pathIssues, path] = configuration.getPathParameters(request, getWithPathParamsPathDeserializer)
    const handlerResults = await api.getWithPathParams({ path, issues: [...pathIssues] }, { request, response, next })
  },
)
