import { failure, fluent, isSuccess, success, zip } from '@oats-ts/try'
import { stringify } from '@oats-ts/validators'
import { BookStoreApi } from '../../generated/book-store/apiType'
import {
  GetBooksServerRequest,
  AddBookServerRequest,
  GetBookServerRequest,
} from '../../generated/book-store/requestServerTypes'
import {
  GetBooksServerResponse,
  AddBookServerResponse,
  GetBookServerResponse,
} from '../../generated/book-store/responseServerTypes'
import { AppError, Book } from '../../generated/book-store/types'
import { defaultBooks } from './bookStore.testdata'

export class BookStoreApiImpl implements BookStoreApi {
  private books: Book[] = Array.from(defaultBooks)

  async addBook(request: AddBookServerRequest): Promise<AddBookServerResponse> {
    const bookTry = fluent(request.body).map((body): Book => {
      const book: Book = {
        ...body,
        id: Math.max(...this.books.map(({ id }) => id)) + 1,
      }
      this.books.push(book)
      return book
    })
    if (isSuccess(bookTry)) {
      return {
        body: bookTry.data,
        mimeType: 'application/json',
        statusCode: 201,
      }
    }
    return {
      body: bookTry.issues.map(stringify).map((message): AppError => ({ message })),
      mimeType: 'application/json',
      statusCode: 400,
    }
  }

  async getBooks(request: GetBooksServerRequest): Promise<GetBooksServerResponse> {
    const booksTry = fluent(zip(request.headers, request.query)).map(([headers, query]) => {
      const start = query.offset ?? 0
      const end = start + (headers['x-limit'] ?? this.books.length - start)
      return this.books.slice(start, end)
    })
    if (isSuccess(booksTry)) {
      return {
        statusCode: 200,
        mimeType: 'application/json',
        body: booksTry.data,
        headers: { 'x-length': booksTry.data.length },
      }
    }
    return {
      statusCode: 400,
      mimeType: 'application/json',
      body: booksTry.issues.map(stringify).map((message): AppError => ({ message })),
    }
  }

  async getBook(input: GetBookServerRequest): Promise<GetBookServerResponse> {
    const bookTry = fluent(input.path).flatMap(({ bookId }) => {
      const book = this.books.find(({ id }) => id === bookId)
      return book === undefined
        ? failure({
            message: `No book with id ${bookId}`,
            severity: 'error',
            path: 'path.bookId',
          })
        : success(book)
    })
    if (isSuccess(bookTry)) {
      return {
        body: bookTry.data,
        mimeType: 'application/json',
        statusCode: 200,
      }
    }
    return {
      body: bookTry.issues.map(stringify).map((message): AppError => ({ message })),
      mimeType: 'application/json',
      statusCode: 400,
    }
  }
}
