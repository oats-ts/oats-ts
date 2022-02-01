import { ClientAdapter, HttpResponse, RawHttpRequest } from '@oats-ts/openapi-http'
import { object, shape, string } from '@oats-ts/validators'

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

export async function deleteMethod(configuration: ClientAdapter): Promise<DeleteMethodResponse> {
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
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
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

export async function getMethod(configuration: ClientAdapter): Promise<GetMethodResponse> {
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
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
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

export async function optionsMethod(configuration: ClientAdapter): Promise<OptionsMethodResponse> {
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
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
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

export async function patchMethod(configuration: ClientAdapter): Promise<PatchMethodResponse> {
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
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
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

export async function postMethod(configuration: ClientAdapter): Promise<PostMethodResponse> {
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
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
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

export async function putMethod(configuration: ClientAdapter): Promise<PutMethodResponse> {
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
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
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

export class HttpMethodsSdkImpl implements HttpMethodsSdk {
  protected readonly config: ClientAdapter
  public constructor(config: ClientAdapter) {
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
