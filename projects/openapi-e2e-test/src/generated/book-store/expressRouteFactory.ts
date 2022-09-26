/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter } from '@oats-ts/openapi-http'
import { Router } from 'express'
import { BookStoreApi } from './apiType'
import { addBookRouter, getBookRouter, getBooksRouter } from './expressRoutes'
import { BookStoreRouters } from './expressRoutesType'

export function createBookStoreRouter(
  api: BookStoreApi,
  adapter: ServerAdapter<ExpressToolkit>,
  routes: Partial<BookStoreRouters> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_adapter'] = adapter
      next()
    },
    routes.getBooksRouter ?? getBooksRouter,
    routes.addBookRouter ?? addBookRouter,
    routes.getBookRouter ?? getBookRouter,
  )
}