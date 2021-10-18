import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { NextFunction, Request, Response, Router } from 'express'
import { Api } from '../api/Api'

export const postSimpleNamedObjectRoute: Router = Router().post(
  '/simple-named-object',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const configuration: ServerConfiguration<Request, Response> = response.locals['__oats_configuration']
    const api: Api<ExpressParameters> = response.locals['__oats_api']
    const [bodyIssues, body, mimeType] = configuration.getRequestBody(request, undefined)
    const handlerResults = await api.postSimpleNamedObject(
      { mimeType, body, issues: [...bodyIssues] },
      { request, response, next },
    )
  },
)
