import { HttpResponse, RawHttpRequest, RawHttpResponse } from '@oats-ts/openapi-http'
import { ClientConfiguration } from '@oats-ts/openapi-http-client'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { getData } from '@oats-ts/try'
import { object, shape, string } from '@oats-ts/validators'
import { NextFunction, Request, Response, Router } from 'express'

export const deleteMethodResponseBodyValidator = {
  200: { 'application/json': object(shape({ methodUsed: string() })) },
} as const

export const getMethodResponseBodyValidator = {
  200: { 'application/json': object(shape({ methodUsed: string() })) },
} as const

export const optionsMethodResponseBodyValidator = {
  200: { 'application/json': object(shape({ methodUsed: string() })) },
} as const

export const patchMethodResponseBodyValidator = {
  200: { 'application/json': object(shape({ methodUsed: string() })) },
} as const

export const postMethodResponseBodyValidator = {
  200: { 'application/json': object(shape({ methodUsed: string() })) },
} as const

export const putMethodResponseBodyValidator = {
  200: { 'application/json': object(shape({ methodUsed: string() })) },
} as const

export type DeleteMethodResponse = HttpResponse<
  {
    methodUsed: string
  },
  200,
  'application/json',
  undefined
>

export type GetMethodResponse = HttpResponse<
  {
    methodUsed: string
  },
  200,
  'application/json',
  undefined
>

export type OptionsMethodResponse = HttpResponse<
  {
    methodUsed: string
  },
  200,
  'application/json',
  undefined
>

export type PatchMethodResponse = HttpResponse<
  {
    methodUsed: string
  },
  200,
  'application/json',
  undefined
>

export type PostMethodResponse = HttpResponse<
  {
    methodUsed: string
  },
  200,
  'application/json',
  undefined
>

export type PutMethodResponse = HttpResponse<
  {
    methodUsed: string
  },
  200,
  'application/json',
  undefined
>

export async function deleteMethod(configuration: ClientConfiguration): Promise<DeleteMethodResponse> {
  const requestUrl = await configuration.getUrl('/delete-method', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'delete',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = getData(await configuration.getResponseHeaders(rawResponse, statusCode, undefined))
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    deleteMethodResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as DeleteMethodResponse
  return response
}

export async function getMethod(configuration: ClientConfiguration): Promise<GetMethodResponse> {
  const requestUrl = await configuration.getUrl('/get-method', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'get',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = getData(await configuration.getResponseHeaders(rawResponse, statusCode, undefined))
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    getMethodResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as GetMethodResponse
  return response
}

export async function optionsMethod(configuration: ClientConfiguration): Promise<OptionsMethodResponse> {
  const requestUrl = await configuration.getUrl('/options-method', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'options',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = getData(await configuration.getResponseHeaders(rawResponse, statusCode, undefined))
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    optionsMethodResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as OptionsMethodResponse
  return response
}

export async function patchMethod(configuration: ClientConfiguration): Promise<PatchMethodResponse> {
  const requestUrl = await configuration.getUrl('/patch-method', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'patch',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = getData(await configuration.getResponseHeaders(rawResponse, statusCode, undefined))
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    patchMethodResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as PatchMethodResponse
  return response
}

export async function postMethod(configuration: ClientConfiguration): Promise<PostMethodResponse> {
  const requestUrl = await configuration.getUrl('/post-method', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = getData(await configuration.getResponseHeaders(rawResponse, statusCode, undefined))
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    postMethodResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as PostMethodResponse
  return response
}

export async function putMethod(configuration: ClientConfiguration): Promise<PutMethodResponse> {
  const requestUrl = await configuration.getUrl('/put-method', undefined)
  const requestHeaders = await configuration.getRequestHeaders(undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'put',
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = getData(await configuration.getResponseHeaders(rawResponse, statusCode, undefined))
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    putMethodResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as PutMethodResponse
  return response
}

export type HttpMethodsSdk = {
  deleteMethod(): Promise<DeleteMethodResponse>
  getMethod(): Promise<GetMethodResponse>
  optionsMethod(): Promise<OptionsMethodResponse>
  patchMethod(): Promise<PatchMethodResponse>
  postMethod(): Promise<PostMethodResponse>
  putMethod(): Promise<PutMethodResponse>
}

export class HttpMethodsClientSdk implements HttpMethodsSdk {
  protected readonly config: ClientConfiguration
  public constructor(config: ClientConfiguration) {
    this.config = config
  }
  public async deleteMethod(): Promise<DeleteMethodResponse> {
    return deleteMethod(this.config)
  }
  public async getMethod(): Promise<GetMethodResponse> {
    return getMethod(this.config)
  }
  public async optionsMethod(): Promise<OptionsMethodResponse> {
    return optionsMethod(this.config)
  }
  public async patchMethod(): Promise<PatchMethodResponse> {
    return patchMethod(this.config)
  }
  public async postMethod(): Promise<PostMethodResponse> {
    return postMethod(this.config)
  }
  public async putMethod(): Promise<PutMethodResponse> {
    return putMethod(this.config)
  }
}

export class HttpMethodsSdkStub implements HttpMethodsSdk {
  public async deleteMethod(): Promise<DeleteMethodResponse> {
    throw new Error('Stub method "deleteMethod" called. You should implement this method if you want to use it.')
  }
  public async getMethod(): Promise<GetMethodResponse> {
    throw new Error('Stub method "getMethod" called. You should implement this method if you want to use it.')
  }
  public async optionsMethod(): Promise<OptionsMethodResponse> {
    throw new Error('Stub method "optionsMethod" called. You should implement this method if you want to use it.')
  }
  public async patchMethod(): Promise<PatchMethodResponse> {
    throw new Error('Stub method "patchMethod" called. You should implement this method if you want to use it.')
  }
  public async postMethod(): Promise<PostMethodResponse> {
    throw new Error('Stub method "postMethod" called. You should implement this method if you want to use it.')
  }
  public async putMethod(): Promise<PutMethodResponse> {
    throw new Error('Stub method "putMethod" called. You should implement this method if you want to use it.')
  }
}

export type HttpMethodsApi<T> = {
  deleteMethod(frameworkInput: T): Promise<DeleteMethodResponse>
  getMethod(frameworkInput: T): Promise<GetMethodResponse>
  optionsMethod(frameworkInput: T): Promise<OptionsMethodResponse>
  patchMethod(frameworkInput: T): Promise<PatchMethodResponse>
  postMethod(frameworkInput: T): Promise<PostMethodResponse>
  putMethod(frameworkInput: T): Promise<PutMethodResponse>
}

export const deleteMethodRouter: Router = Router().delete(
  '/delete-method',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: HttpMethodsApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const typedResponse = await api.deleteMethod(frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const getMethodRouter: Router = Router().get(
  '/get-method',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: HttpMethodsApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const typedResponse = await api.getMethod(frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const optionsMethodRouter: Router = Router().options(
  '/options-method',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: HttpMethodsApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const typedResponse = await api.optionsMethod(frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const patchMethodRouter: Router = Router().patch(
  '/patch-method',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: HttpMethodsApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const typedResponse = await api.patchMethod(frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const postMethodRouter: Router = Router().post(
  '/post-method',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: HttpMethodsApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const typedResponse = await api.postMethod(frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const putMethodRouter: Router = Router().put(
  '/put-method',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: HttpMethodsApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const typedResponse = await api.putMethod(frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export type HttpMethodsRouters = {
  deleteMethodRouter: Router
  getMethodRouter: Router
  optionsMethodRouter: Router
  patchMethodRouter: Router
  postMethodRouter: Router
  putMethodRouter: Router
}

export function createHttpMethodsRouter(
  api: HttpMethodsApi<ExpressParameters>,
  configuration: ServerConfiguration<ExpressParameters>,
  routes: Partial<HttpMethodsRouters> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_configuration'] = configuration
      next()
    },
    routes.deleteMethodRouter ?? deleteMethodRouter,
    routes.getMethodRouter ?? getMethodRouter,
    routes.optionsMethodRouter ?? optionsMethodRouter,
    routes.patchMethodRouter ?? patchMethodRouter,
    routes.postMethodRouter ?? postMethodRouter,
    routes.putMethodRouter ?? putMethodRouter,
  )
}
