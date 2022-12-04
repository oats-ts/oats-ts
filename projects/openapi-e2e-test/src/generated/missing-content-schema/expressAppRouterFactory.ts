/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from edge-cases/missing-content-schema.json (originating from oats-ts/oats-schemas)
 */

import { IRouter, Router } from 'express'
import { createMissingRequestBodySchemaRouter, createMissingResponseSchemaRouter } from './expressRouterFactories'
import { MissingContentSchemaRouterFactories } from './expressRouterFactoriesType'

export function createMissingContentSchemaAppRouter(
  router?: IRouter | undefined,
  overrides: Partial<MissingContentSchemaRouterFactories> = {},
): IRouter {
  const root = router ?? Router()
  const factories = [
    overrides.createMissingResponseSchemaRouter ?? createMissingResponseSchemaRouter,
    overrides.createMissingRequestBodySchemaRouter ?? createMissingRequestBodySchemaRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}
