/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-yaml.yaml (originating from oats-ts/oats-schemas)
 */

import { IRouter, Router } from 'express'
import { createCreatePetsRouter, createListPetsRouter, createShowPetByIdRouter } from './expressRouterFactories'
import { SwaggerPetstoreYamlRouterFactories } from './expressRouterFactoriesType'

export function createSwaggerPetstoreYamlAppRouter(
  router?: IRouter | undefined,
  overrides: Partial<SwaggerPetstoreYamlRouterFactories> = {},
): IRouter {
  const root = router ?? Router()
  const factories = [
    overrides.createCreatePetsRouter ?? createCreatePetsRouter,
    overrides.createListPetsRouter ?? createListPetsRouter,
    overrides.createShowPetByIdRouter ?? createShowPetByIdRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}
