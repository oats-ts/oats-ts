import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { Router } from 'express'
import { Api } from '../api/Api'
import { getSimpleNamedObjectRoute } from './getSimpleNamedObjectRoute'
import { getWithDefaultResponseRoute } from './getWithDefaultResponseRoute'
import { getWithHeaderParamsRoute } from './getWithHeaderParamsRoute'
import { getWithMultipleResponsesRoute } from './getWithMultipleResponsesRoute'
import { getWithPathParamsRoute } from './getWithPathParamsRoute'
import { getWithQueryParamsRoute } from './getWithQueryParamsRoute'
import { postSimpleNamedObjectRoute } from './postSimpleNamedObjectRoute'
import { Routes } from './Routes'
import { sampleOperationRoute } from './sampleOperationRoute'

export function createMainRoute(
  api: Api<ExpressParameters>,
  configuration: ServerConfiguration<ExpressParameters>,
  routes: Partial<Routes> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_configuration'] = configuration
      next()
    },
    routes.getSimpleNamedObjectRoute ?? getSimpleNamedObjectRoute,
    routes.getWithDefaultResponseRoute ?? getWithDefaultResponseRoute,
    routes.getWithHeaderParamsRoute ?? getWithHeaderParamsRoute,
    routes.getWithMultipleResponsesRoute ?? getWithMultipleResponsesRoute,
    routes.getWithPathParamsRoute ?? getWithPathParamsRoute,
    routes.getWithQueryParamsRoute ?? getWithQueryParamsRoute,
    routes.postSimpleNamedObjectRoute ?? postSimpleNamedObjectRoute,
    routes.sampleOperationRoute ?? sampleOperationRoute,
  )
}
