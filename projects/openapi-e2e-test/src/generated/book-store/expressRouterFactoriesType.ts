/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/book-store.json (originating from oats-ts/oats-schemas)
 */

import { IRouter } from 'express'

export type BookStoreRouterFactories = {
  createAddBookRouter: (router?: IRouter | undefined) => IRouter
  createGetBookRouter: (router?: IRouter | undefined) => IRouter
  createGetBooksRouter: (router?: IRouter | undefined) => IRouter
}
