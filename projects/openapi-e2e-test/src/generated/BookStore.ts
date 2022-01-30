import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import {
  ClientAdapter,
  HasPathParameters,
  HasRequestBody,
  HttpResponse,
  RawHttpRequest,
  RawHttpResponse,
  ServerAdapter,
} from '@oats-ts/openapi-http'
import { createPathDeserializer, deserializers } from '@oats-ts/openapi-parameter-deserialization'
import { createPathSerializer, serializers } from '@oats-ts/openapi-parameter-serialization'
import { Try } from '@oats-ts/try'
import { array, enumeration, items, lazy, number, object, optional, shape, string } from '@oats-ts/validators'
import { NextFunction, Request, RequestHandler, Response, Router } from 'express'

export type AppError = {
  message: string
}

export type Book = {
  author: string
  bookType: BookType
  description?: string
  id: number
  price: number
  title: string
}

export type BookType = 'paperback' | 'digital' | 'audio'

export const appErrorTypeValidator = object(shape({ message: string() }))

export const bookTypeTypeValidator = enumeration(['paperback', 'digital', 'audio'])

export const bookTypeValidator = object(
  shape({
    author: string(),
    bookType: lazy(() => bookTypeTypeValidator),
    description: optional(string()),
    id: number(),
    price: number(),
    title: string(),
  }),
)

export function isAppError(input: any): input is AppError {
  return input !== null && typeof input === 'object' && typeof input.message === 'string'
}

export function isBook(input: any): input is Book {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.author === 'string' &&
    isBookType(input.bookType) &&
    (input.description === null || input.description === undefined || typeof input.description === 'string') &&
    typeof input.id === 'number' &&
    typeof input.price === 'number' &&
    typeof input.title === 'string'
  )
}

export function isBookType(input: any): input is BookType {
  return input === 'paperback' || input === 'digital' || input === 'audio'
}

export type GetBookPathParameters = {
  /**
   * The id of the book
   */
  bookId: number
}

export type UpdateBookPathParameters = {
  /**
   * The id of the book
   */
  bookId: number
}

export type CreateBookRequest = HasRequestBody<'application/json', Book>

export type GetBookRequest = HasPathParameters<GetBookPathParameters>

export type UpdateBookRequest = HasPathParameters<UpdateBookPathParameters> & HasRequestBody<'application/json', Book>

export type CreateBookServerRequest = HasRequestBody<'application/json', Try<Book>>

export type GetBookServerRequest = HasPathParameters<Try<GetBookPathParameters>>

export type UpdateBookServerRequest = HasPathParameters<Try<UpdateBookPathParameters>> &
  HasRequestBody<'application/json', Try<Book>>

export const createBookResponseBodyValidator = {
  201: { 'application/json': bookTypeValidator },
  400: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
} as const

export const getBookResponseBodyValidator = {
  200: { 'application/json': bookTypeValidator },
  400: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
} as const

export const getBooksResponseBodyValidator = {
  200: { 'application/json': array(items(lazy(() => bookTypeValidator))) },
  400: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
} as const

export const updateBookResponseBodyValidator = {
  200: { 'application/json': bookTypeValidator },
  400: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
  500: { 'application/json': array(items(lazy(() => appErrorTypeValidator))) },
} as const

export const createBookRequestBodyValidator = { 'application/json': bookTypeValidator } as const

export const updateBookRequestBodyValidator = { 'application/json': bookTypeValidator } as const

export type CreateBookResponse =
  | HttpResponse<Book, 201, 'application/json', undefined>
  | HttpResponse<AppError[], 400, 'application/json', undefined>
  | HttpResponse<AppError[], 500, 'application/json', undefined>

export type GetBookResponse =
  | HttpResponse<Book, 200, 'application/json', undefined>
  | HttpResponse<AppError[], 400, 'application/json', undefined>
  | HttpResponse<AppError[], 500, 'application/json', undefined>

export type GetBooksResponse =
  | HttpResponse<Book[], 200, 'application/json', undefined>
  | HttpResponse<AppError[], 400, 'application/json', undefined>
  | HttpResponse<AppError[], 500, 'application/json', undefined>

export type UpdateBookResponse =
  | HttpResponse<Book, 200, 'application/json', undefined>
  | HttpResponse<AppError[], 400, 'application/json', undefined>
  | HttpResponse<AppError[], 500, 'application/json', undefined>

export const getBookPathSerializer = createPathSerializer<GetBookPathParameters>('/books/{bookId}', {
  bookId: serializers.path.simple.primitive<number>({}),
})

export const updateBookPathSerializer = createPathSerializer<UpdateBookPathParameters>('/books/{bookId}', {
  bookId: serializers.path.simple.primitive<number>({}),
})

export const getBookPathDeserializer = createPathDeserializer<GetBookPathParameters>(
  ['bookId'],
  /^\/books(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  { bookId: deserializers.path.simple.primitive(deserializers.value.number(), {}) },
)

export const updateBookPathDeserializer = createPathDeserializer<UpdateBookPathParameters>(
  ['bookId'],
  /^\/books(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  { bookId: deserializers.path.simple.primitive(deserializers.value.number(), {}) },
)

/**
 * Creates a new book based on the request body. The id field can be ommited (will be ignored)
 */
export async function createBook(input: CreateBookRequest, configuration: ClientAdapter): Promise<CreateBookResponse> {
  const requestUrl = await configuration.getUrl('/books', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    createBookResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as CreateBookResponse
  return response
}

/**
 * Returns the book associated with the given bookId
 */
export async function getBook(input: GetBookRequest, configuration: ClientAdapter): Promise<GetBookResponse> {
  const path = await configuration.getPath(input, getBookPathSerializer)
  const requestUrl = await configuration.getUrl(path, undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'get',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    getBookResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as GetBookResponse
  return response
}

export async function getBooks(configuration: ClientAdapter): Promise<GetBooksResponse> {
  const requestUrl = await configuration.getUrl('/books', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'get',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    getBooksResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as GetBooksResponse
  return response
}

/**
 * Updates the book associated with the given bookId
 */
export async function updateBook(input: UpdateBookRequest, configuration: ClientAdapter): Promise<UpdateBookResponse> {
  const path = await configuration.getPath(input, updateBookPathSerializer)
  const requestUrl = await configuration.getUrl(path, undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'patch',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    updateBookResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as UpdateBookResponse
  return response
}

export type BookStoreSdk = {
  /**
   * Creates a new book based on the request body. The id field can be ommited (will be ignored)
   */
  createBook(input: CreateBookRequest): Promise<CreateBookResponse>
  /**
   * Returns the book associated with the given bookId
   */
  getBook(input: GetBookRequest): Promise<GetBookResponse>
  getBooks(): Promise<GetBooksResponse>
  /**
   * Updates the book associated with the given bookId
   */
  updateBook(input: UpdateBookRequest): Promise<UpdateBookResponse>
}

export class BookStoreSdkImpl implements BookStoreSdk {
  protected readonly config: ClientAdapter
  public constructor(config: ClientAdapter) {
    this.config = config
  }
  public async createBook(input: CreateBookRequest): Promise<CreateBookResponse> {
    return createBook(input, this.config)
  }
  public async getBook(input: GetBookRequest): Promise<GetBookResponse> {
    return getBook(input, this.config)
  }
  public async getBooks(): Promise<GetBooksResponse> {
    return getBooks(this.config)
  }
  public async updateBook(input: UpdateBookRequest): Promise<UpdateBookResponse> {
    return updateBook(input, this.config)
  }
}

export class BookStoreSdkStub implements BookStoreSdk {
  public async createBook(_input: CreateBookRequest): Promise<CreateBookResponse> {
    throw new Error('Stub method "createBook" called. You should implement this method if you want to use it.')
  }
  public async getBook(_input: GetBookRequest): Promise<GetBookResponse> {
    throw new Error('Stub method "getBook" called. You should implement this method if you want to use it.')
  }
  public async getBooks(): Promise<GetBooksResponse> {
    throw new Error('Stub method "getBooks" called. You should implement this method if you want to use it.')
  }
  public async updateBook(_input: UpdateBookRequest): Promise<UpdateBookResponse> {
    throw new Error('Stub method "updateBook" called. You should implement this method if you want to use it.')
  }
}

export type BookStoreApi<T> = {
  /**
   * Creates a new book based on the request body. The id field can be ommited (will be ignored)
   */
  createBook(request: CreateBookServerRequest, toolkit: T): Promise<CreateBookResponse>
  /**
   * Returns the book associated with the given bookId
   */
  getBook(request: GetBookServerRequest, toolkit: T): Promise<GetBookResponse>
  getBooks(toolkit: T): Promise<GetBooksResponse>
  /**
   * Updates the book associated with the given bookId
   */
  updateBook(request: UpdateBookServerRequest, toolkit: T): Promise<UpdateBookResponse>
}

export const createBookRouter: Router = Router().post(
  '/books',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const configuration: ServerAdapter<ExpressToolkit> = response.locals['__oats_configuration']
    const api: BookStoreApi<ExpressToolkit> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json'>(toolkit)
      const body = await configuration.getRequestBody<'application/json', Book>(
        toolkit,
        mimeType,
        createBookRequestBodyValidator,
      )
      const typedRequest: CreateBookServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.createBook(typedRequest, toolkit)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(toolkit, typedResponse),
        body: await configuration.getResponseBody(toolkit, typedResponse),
      }
      return configuration.respond(toolkit, rawResponse)
    } catch (error) {
      configuration.handleError(toolkit, error)
      throw error
    }
  },
)

export const getBookRouter: Router = Router().get(
  '/books/:bookId',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const configuration: ServerAdapter<ExpressToolkit> = response.locals['__oats_configuration']
    const api: BookStoreApi<ExpressToolkit> = response.locals['__oats_api']
    try {
      const path = await configuration.getPathParameters(toolkit, getBookPathDeserializer)
      const typedRequest: GetBookServerRequest = {
        path,
      }
      const typedResponse = await api.getBook(typedRequest, toolkit)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(toolkit, typedResponse),
        body: await configuration.getResponseBody(toolkit, typedResponse),
      }
      return configuration.respond(toolkit, rawResponse)
    } catch (error) {
      configuration.handleError(toolkit, error)
      throw error
    }
  },
)

export const getBooksRouter: Router = Router().get(
  '/books',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const configuration: ServerAdapter<ExpressToolkit> = response.locals['__oats_configuration']
    const api: BookStoreApi<ExpressToolkit> = response.locals['__oats_api']
    try {
      const typedResponse = await api.getBooks(toolkit)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(toolkit, typedResponse),
        body: await configuration.getResponseBody(toolkit, typedResponse),
      }
      return configuration.respond(toolkit, rawResponse)
    } catch (error) {
      configuration.handleError(toolkit, error)
      throw error
    }
  },
)

export const updateBookRouter: Router = Router().patch(
  '/books/:bookId',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const configuration: ServerAdapter<ExpressToolkit> = response.locals['__oats_configuration']
    const api: BookStoreApi<ExpressToolkit> = response.locals['__oats_api']
    try {
      const path = await configuration.getPathParameters(toolkit, updateBookPathDeserializer)
      const mimeType = await configuration.getMimeType<'application/json'>(toolkit)
      const body = await configuration.getRequestBody<'application/json', Book>(
        toolkit,
        mimeType,
        updateBookRequestBodyValidator,
      )
      const typedRequest: UpdateBookServerRequest = {
        path,
        mimeType,
        body,
      }
      const typedResponse = await api.updateBook(typedRequest, toolkit)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(toolkit, typedResponse),
        body: await configuration.getResponseBody(toolkit, typedResponse),
      }
      return configuration.respond(toolkit, rawResponse)
    } catch (error) {
      configuration.handleError(toolkit, error)
      throw error
    }
  },
)

export type BookStoreRouters = {
  createBookRouter: Router
  getBookRouter: Router
  getBooksRouter: Router
  updateBookRouter: Router
}

export function createBookStoreRouter(
  api: BookStoreApi<ExpressToolkit>,
  configuration: ServerAdapter<ExpressToolkit>,
  routes: Partial<BookStoreRouters> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_configuration'] = configuration
      next()
    },
    routes.createBookRouter ?? createBookRouter,
    routes.getBookRouter ?? getBookRouter,
    routes.getBooksRouter ?? getBooksRouter,
    routes.updateBookRouter ?? updateBookRouter,
  )
}

export const bookStoreCorsMiddleware =
  (...origins: string[]): RequestHandler =>
  (request: Request, response: Response, next: NextFunction) => {
    if (
      typeof request.headers.origin === 'string' &&
      (origins.indexOf(request.headers.origin) >= 0 || origins.indexOf('*') >= 0)
    ) {
      response.setHeader('Access-Control-Allow-Origin', request.headers.origin)
      response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH')
      response.setHeader('Access-Control-Allow-Headers', 'content-type')
    }
    next()
  }
