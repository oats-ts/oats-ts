/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/book-store.json (originating from oats-ts/oats-schemas)
 */

import { AddBookRequest, GetBookRequest, GetBooksRequest } from './requestTypes'
import { AddBookResponse, GetBookResponse, GetBooksResponse } from './responseTypes'

export type BookStoreSdk = {
  /**
   * Returns a list of books, can be paginated
   */
  getBooks(request: GetBooksRequest): Promise<GetBooksResponse>
  /**
   * Creates a new book based on the request body.
   */
  addBook(request: AddBookRequest): Promise<AddBookResponse>
  /**
   * Returns the book associated with the given bookId
   */
  getBook(request: GetBookRequest): Promise<GetBookResponse>
}
