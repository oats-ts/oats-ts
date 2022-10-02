/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/generated-schemas/methods.json
 */

import { IRouter, Router } from 'express'
import {
  createDeleteMethodRouter,
  createGetMethodRouter,
  createOptionsMethodRouter,
  createPatchMethodRouter,
  createPostMethodRouter,
  createPutMethodRouter,
} from './expressRouterFactories'
import { HttpMethodsRouterFactories } from './expressRouterFactoriesType'

export function createHttpMethodsAppRouter(
  router?: IRouter,
  overrides: Partial<HttpMethodsRouterFactories> = {},
): IRouter {
  const root = router ?? Router()
  const factories = [
    overrides.createGetMethodRouter ?? createGetMethodRouter,
    overrides.createPostMethodRouter ?? createPostMethodRouter,
    overrides.createPutMethodRouter ?? createPutMethodRouter,
    overrides.createPatchMethodRouter ?? createPatchMethodRouter,
    overrides.createOptionsMethodRouter ?? createOptionsMethodRouter,
    overrides.createDeleteMethodRouter ?? createDeleteMethodRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}