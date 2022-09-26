/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { AddBookServerRequest, GetBookServerRequest, GetBooksServerRequest } from './requestServerTypes'
import { AddBookServerResponse, GetBookServerResponse, GetBooksServerResponse } from './responseServerTypes'

export type BookStoreApi = {
  /**
   * Returns a list of books, can be paginated
   */
  getBooks(request: GetBooksServerRequest): Promise<GetBooksServerResponse>
  /**
   * Creates a new book based on the request body.
   */
  addBook(request: AddBookServerRequest): Promise<AddBookServerResponse>
  /**
   * Returns the book associated with the given bookId
   */
  getBook(request: GetBookServerRequest): Promise<GetBookServerResponse>
}