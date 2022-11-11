/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/book-store.json (originating from oats-ts/oats-schemas)
 */

import { IRouter, Router } from 'express'
import { createAddBookRouter, createGetBookRouter, createGetBooksRouter } from './expressRouterFactories'
import { BookStoreRouterFactories } from './expressRouterFactoriesType'

export function createBookStoreAppRouter(
  router?: IRouter | undefined,
  overrides: Partial<BookStoreRouterFactories> = {},
): IRouter {
  const root = router ?? Router()
  const factories = [
    overrides.createGetBooksRouter ?? createGetBooksRouter,
    overrides.createAddBookRouter ?? createAddBookRouter,
    overrides.createGetBookRouter ?? createGetBookRouter,
  ]
  const uniqueRouters = factories.map((factory) => factory(router)).filter((childRouter) => childRouter !== root)
  return uniqueRouters.length === 0 ? root : root.use(...uniqueRouters)
}
