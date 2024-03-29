/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/partial-content.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { RawHttpResponse, ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { PartialContentApi } from './apiType'
import { optionalRequestBodyRequestBodyValidator } from './requestBodyValidators'
import { OptionalRequestBodyServerRequest } from './requestServerTypes'

export function createMissingBodyRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).get(
    '/missing-body',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_my940s']
      const api: PartialContentApi = response.locals['__oats_api_my940s']
      try {
        const typedResponse = await api.missingBody()
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, undefined),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createOptionalRequestBodyRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/optional-request-body',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_my940s']
      const api: PartialContentApi = response.locals['__oats_api_my940s']
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
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, undefined),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}
