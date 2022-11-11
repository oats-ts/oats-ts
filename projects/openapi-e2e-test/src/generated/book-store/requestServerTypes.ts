/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/book-store.json (originating from oats-ts/oats-schemas)
 */

import { Try } from '@oats-ts/openapi-runtime'
import { GetBookPathParameters } from './pathTypes'
import { GetBooksQueryParameters } from './queryTypes'
import { GetBooksRequestHeaderParameters } from './requestHeaderTypes'
import { Book } from './types'

export type AddBookServerRequest = {
  mimeType: 'application/json'
  body: Try<Book>
}

export type GetBookServerRequest = {
  path: Try<GetBookPathParameters>
}

export type GetBooksServerRequest = {
  headers: Try<GetBooksRequestHeaderParameters>
  query: Try<GetBooksQueryParameters>
}
