import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { Router } from 'express'
import { TestApi } from '../api/TestApi'
import { simplePathParametersRoute } from './simplePathParametersRoute'
import { TestRoutes } from './TestRoutes'

export function createTestMainRoute(
  api: TestApi<ExpressParameters>,
  configuration: ServerConfiguration<ExpressParameters>,
  routes: Partial<TestRoutes> = {},
): Router {
  return Router().use((_, response, next) => {
    response.locals['__oats_api'] = api
    response.locals['__oats_configuration'] = configuration
    next()
  }, routes.simplePathParametersRoute ?? simplePathParametersRoute)
}
