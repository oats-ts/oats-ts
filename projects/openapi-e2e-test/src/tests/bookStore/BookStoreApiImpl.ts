import { failure, fluent, success, zip } from '@oats-ts/try'
import { Issue, IssueTypes, stringify } from '@oats-ts/validators'
import {
  BookStoreApi,
  GetBookResponse,
  GetBookServerRequest,
  GetBooksResponse,
  Book,
  AppError,
  AddBookResponse,
  AddBookServerRequest,
  GetBooksServerRequest,
} from '../../generated/book-store'
import { defaultBooks } from './bookStore.testdata'

export class BookStoreApiImpl implements BookStoreApi {
  private books: Book[] = Array.from(defaultBooks)

  async addBook(request: AddBookServerRequest): Promise<AddBookResponse> {
    return fluent(request.body)
      .map(
        (book): Book => ({
          ...book,
          id: Math.max(...this.books.map(({ id }) => id)) + 1,
        }),
      )
      .doIfSuccess((book) => this.books.push(book))
      .get(
        (book): AddBookResponse => ({
          body: book,
          mimeType: 'application/json',
          statusCode: 201,
        }),
        (issues: Issue[]): AddBookResponse => ({
          body: issues.map(stringify).map((message): AppError => ({ message })),
          mimeType: 'application/json',
          statusCode: 400,
        }),
      )
  }

  async getBooks(request: GetBooksServerRequest): Promise<GetBooksResponse> {
    fluent(zip(request.headers, request.query))
      .map(([headers, query]) => {
        const start = query.offset ?? 0
        const end = start + (headers['x-limit'] ?? this.books.length - start)
        return this.books.slice(start, end)
      })
      .get(
        (books): GetBooksResponse => ({
          statusCode: 200,
          mimeType: 'application/json',
          body: books,
          headers: { 'x-length': books.length },
        }),
        (issues): GetBooksResponse => ({
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

  async getBook(input: GetBookServerRequest): Promise<GetBookResponse> {
    return fluent(input.path)
      .flatMap(({ bookId }) => {
        const book = this.books.find(({ id }) => id === bookId)
        return book === undefined
          ? failure([
              {
                message: `No book with id ${bookId}`,
                severity: 'error',
                path: 'path.bookId',
                type: IssueTypes.value,
              },
            ])
          : success(book)
      })
      .get(
        (book): GetBookResponse => ({
          body: book,
          mimeType: 'application/json',
          statusCode: 200,
        }),
        (issues: Issue[]): GetBookResponse => ({
          body: issues.map(stringify).map((message): AppError => ({ message })),
          mimeType: 'application/json',
          statusCode: 400,
        }),
      )
  }
}
