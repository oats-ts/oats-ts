import { failure, fluent, success, zip } from '@oats-ts/try'
import { Issue, stringify } from '@oats-ts/validators'
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
    return fluent(request.body)
      .map((body): Book => {
        const book: Book = {
          ...body,
          id: Math.max(...this.books.map(({ id }) => id)) + 1,
        }
        this.books.push(book)
        return book
      })
      .get(
        (book): AddBookServerResponse => ({
          body: book,
          mimeType: 'application/json',
          statusCode: 201,
        }),
        (issues: Issue[]): AddBookServerResponse => ({
          body: issues.map(stringify).map((message): AppError => ({ message })),
          mimeType: 'application/json',
          statusCode: 400,
        }),
      )
  }

  async getBooks(request: GetBooksServerRequest): Promise<GetBooksServerResponse> {
    fluent(zip(request.headers, request.query))
      .map(([headers, query]) => {
        const start = query.offset ?? 0
        const end = start + (headers['x-limit'] ?? this.books.length - start)
        return this.books.slice(start, end)
      })
      .get(
        (books): GetBooksServerResponse => ({
          statusCode: 200,
          mimeType: 'application/json',
          body: books,
          headers: { 'x-length': books.length },
        }),
        (issues): GetBooksServerResponse => ({
          statusCode: 400,
          mimeType: 'application/json',
          body: issues.map(stringify).map((message): AppError => ({ message })),
        }),
      )
    return {
      body: this.books,
      mimeType: 'application/json',
      statusCode: 200,
      headers: {
        'x-length': this.books.length,
      },
    }
  }

  async getBook(input: GetBookServerRequest): Promise<GetBookServerResponse> {
    return fluent(input.path)
      .flatMap(({ bookId }) => {
        const book = this.books.find(({ id }) => id === bookId)
        return book === undefined
          ? failure({
              message: `No book with id ${bookId}`,
              severity: 'error',
              path: 'path.bookId',
            })
          : success(book)
      })
      .get(
        (book): GetBookServerResponse => ({
          body: book,
          mimeType: 'application/json',
          statusCode: 200,
        }),
        (issues: Issue[]): GetBookServerResponse => ({
          body: issues.map(stringify).map((message): AppError => ({ message })),
          mimeType: 'application/json',
          statusCode: 400,
        }),
      )
  }
}
