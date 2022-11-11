/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/partial-content.json (originating from oats-ts/oats-schemas)
 */

import { IRouter, Router } from 'express'
import { createMissingBodyRouter, createOptionalRequestBodyRouter } from './expressRouterFactories'
import { PartialContentRouterFactories } from './expressRouterFactoriesType'

export function createPartialContentAppRouter(
  router?: IRouter | undefined,
  overrides: Partial<PartialContentRouterFactories> = {},
): IRouter {
  const root = router ?? Router()
  const factories = [
    overrides.createMissingBodyRouter ?? createMissingBodyRouter,
    overrides.createOptionalRequestBodyRouter ?? createOptionalRequestBodyRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}
