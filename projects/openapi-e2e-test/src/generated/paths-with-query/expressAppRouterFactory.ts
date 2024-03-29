/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/paths-with-query.json (originating from oats-ts/oats-schemas)
 */

import { IRouter, Router } from 'express'
import { createGetFooBarABRouter, createGetFooBoopBarABBCRouter } from './expressRouterFactories'
import { PathsWithQueryParametersRouterFactories } from './expressRouterFactoriesType'

export function createPathsWithQueryParametersAppRouter(
  router?: IRouter | undefined,
  overrides: Partial<PathsWithQueryParametersRouterFactories> = {},
): IRouter {
  const root = router ?? Router()
  const factories = [
    overrides.createGetFooBarABRouter ?? createGetFooBarABRouter,
    overrides.createGetFooBoopBarABBCRouter ?? createGetFooBoopBarABBCRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}
