/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/optional-request-body.json
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ClientAdapter, RawHttpRequest, RawHttpResponse, ServerAdapter } from '@oats-ts/openapi-http'
import { Try } from '@oats-ts/try'
import { object, optional, shape, string } from '@oats-ts/validators'
import { NextFunction, Request, RequestHandler, Response, Router } from 'express'

export type OptionalRequestBodyResponse = {
  mimeType: 'application/json'
  statusCode: 200
  body: {
    foo?: string
  }
}

export type OptionalRequestBodyServerRequest = {
  mimeType?: 'application/json'
  body: Try<
    | {
        foo?: string
      }
    | undefined
  >
}

export const optionalRequestBodyRequestBodyValidator = {
  'application/json': optional(object(shape({ foo: optional(string()) }))),
} as const

export type BodiesApi = {
  optionalRequestBody(request: OptionalRequestBodyServerRequest): Promise<OptionalRequestBodyResponse>
}

export const optionalRequestBodyRouter: Router = Router().post(
  '/optional-request-body',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: BodiesApi = response.locals['__oats_api']
    try {
      const mimeType = await adapter.getMimeType<'application/json'>(toolkit)
      const body = await adapter.getRequestBody<
        'application/json',
        {
          foo?: string
        }
      >(toolkit, false, mimeType, optionalRequestBodyRequestBodyValidator)
      const typedRequest: OptionalRequestBodyServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.optionalRequestBody(typedRequest)
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
      }
      return adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  },
)

export type BodiesRouters = {
  optionalRequestBodyRouter: Router
}

export function createBodiesRouter(
  api: BodiesApi,
  adapter: ServerAdapter<ExpressToolkit>,
  routes: Partial<BodiesRouters> = {},
): Router {
  return Router().use((_, response, next) => {
    response.locals['__oats_api'] = api
    response.locals['__oats_adapter'] = adapter
    next()
  }, routes.optionalRequestBodyRouter ?? optionalRequestBodyRouter)
}

export const bodiesCorsMiddleware: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
  response.setHeader('Access-Control-Allow-Origin', request.header('origin') ?? '*')
  response.setHeader('Access-Control-Allow-Methods', 'POST')
  response.setHeader('Access-Control-Allow-Headers', 'content-type')
  response.setHeader('Access-Control-Expose-Headers', 'content-type')
  next()
}

export type OptionalRequestBodyRequest = {
  mimeType?: 'application/json'
  body?: {
    foo?: string
  }
}

export const optionalRequestBodyResponseBodyValidator = {
  200: { 'application/json': object(shape({ foo: optional(string()) })) },
} as const

export async function optionalRequestBody(
  request: OptionalRequestBodyRequest,
  adapter: ClientAdapter,
): Promise<OptionalRequestBodyResponse> {
  const requestUrl = await adapter.getUrl('/optional-request-body', undefined)
  const requestHeaders = await adapter.getRequestHeaders(undefined, request.mimeType, undefined)
  const requestBody = await adapter.getRequestBody(request.mimeType, request.body)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseBody = await adapter.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    optionalRequestBodyResponseBodyValidator,
  )
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as OptionalRequestBodyResponse
}

export type BodiesSdk = {
  optionalRequestBody(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse>
}

export class BodiesSdkImpl implements BodiesSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async optionalRequestBody(request: OptionalRequestBodyRequest): Promise<OptionalRequestBodyResponse> {
    return optionalRequestBody(request, this.adapter)
  }
}
