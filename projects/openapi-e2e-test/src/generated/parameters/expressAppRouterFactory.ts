/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/parameters.json (originating from oats-ts/oats-schemas)
 */

import { IRouter as _IRouter, Router as _Router } from 'express'
import {
  createDeepObjectQueryParametersRouter,
  createFormCookieParametersRouter,
  createFormQueryParametersRouter,
  createLabelPathParametersRouter,
  createMatrixPathParametersRouter,
  createPipeDelimitedQueryParametersRouter,
  createSimpleHeaderParametersRouter,
  createSimplePathParametersRouter,
  createSimpleResponseHeaderParametersRouter,
  createSpaceDelimitedQueryParametersRouter,
} from './expressRouterFactories'
import { ParametersRouterFactories } from './expressRouterFactoriesType'

export function createParametersAppRouter(
  router?: _IRouter | undefined,
  overrides: Partial<ParametersRouterFactories> = {},
): _IRouter {
  const root = router ?? _Router()
  const factories = [
    overrides.createDeepObjectQueryParametersRouter ?? createDeepObjectQueryParametersRouter,
    overrides.createFormCookieParametersRouter ?? createFormCookieParametersRouter,
    overrides.createFormQueryParametersRouter ?? createFormQueryParametersRouter,
    overrides.createLabelPathParametersRouter ?? createLabelPathParametersRouter,
    overrides.createMatrixPathParametersRouter ?? createMatrixPathParametersRouter,
    overrides.createPipeDelimitedQueryParametersRouter ?? createPipeDelimitedQueryParametersRouter,
    overrides.createSimpleHeaderParametersRouter ?? createSimpleHeaderParametersRouter,
    overrides.createSimplePathParametersRouter ?? createSimplePathParametersRouter,
    overrides.createSimpleResponseHeaderParametersRouter ?? createSimpleResponseHeaderParametersRouter,
    overrides.createSpaceDelimitedQueryParametersRouter ?? createSpaceDelimitedQueryParametersRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}
