import { failure, fluent, success, zip } from '@oats-ts/try'
import { Issue, IssueTypes, stringify } from '@oats-ts/validators'
import {
  BookStoreApi,
  CreateBookResponse,
  CreateBookServerRequest,
  GetBookResponse,
  GetBookServerRequest,
  GetBooksResponse,
  UpdateBookResponse,
  UpdateBookServerRequest,
  Book,
  AppError,
} from '../../generated/book-store'
import { defaultBooks } from './bookStore.testdata'

export class BookStoreApiImpl implements BookStoreApi {
  private books: Book[] = Array.from(defaultBooks)

  async getBooks(): Promise<GetBooksResponse> {
    return {
      body: this.books,
      mimeType: 'application/json',
      statusCode: 200,
    }
  }

  async createBook(input: CreateBookServerRequest): Promise<CreateBookResponse> {
    return fluent(input.body)
      .map(
        (book): Book => ({
          ...book,
          id: Math.max(...this.books.map(({ id }) => id)) + 1,
        }),
      )
      .doIfSuccess((book) => this.books.push(book))
      .get(
        (book): CreateBookResponse => ({
          body: book,
          mimeType: 'application/json',
          statusCode: 201,
        }),
        (issues: Issue[]): CreateBookResponse => ({
          body: issues.map(stringify).map((message): AppError => ({ message })),
          mimeType: 'application/json',
          statusCode: 400,
        }),
      )
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

  async updateBook(input: UpdateBookServerRequest): Promise<UpdateBookResponse> {
    return fluent(zip(input.path, input.body))
      .flatMap<Book>(([{ bookId }, updates]) => {
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
          : success({ ...book, ...updates, id: bookId })
      })
      .doIfSuccess((updatedBook) => {
        this.books = this.books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
      })
      .get(
        (book): UpdateBookResponse => ({
          body: book,
          mimeType: 'application/json',
          statusCode: 200,
        }),
        (issues: Issue[]): UpdateBookResponse => ({
          body: issues.map(stringify).map((message): AppError => ({ message })),
          mimeType: 'application/json',
          statusCode: 400,
        }),
      )
  }
}
