/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/cookies.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { RawHttpResponse, ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { CookiesApi } from './apiType'
import { protectedPathCookieDeserializer } from './cookieDeserializers'
import { loginRequestBodyValidator } from './requestBodyValidators'
import { LoginServerRequest, ProtectedPathServerRequest } from './requestServerTypes'

export function createLoginRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/login',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_ny4wur']
      const api: CookiesApi = response.locals['__oats_api_ny4wur']
      try {
        const mimeType = await adapter.getMimeType<'application/json'>(toolkit)
        const body = await adapter.getRequestBody<
          'application/json',
          {
            name: string
          }
        >(toolkit, true, mimeType, loginRequestBodyValidator)
        const typedRequest: LoginServerRequest = {
          mimeType,
          body,
        }
        const typedResponse = await api.login(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, undefined),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
          cookies: await adapter.getResponseCookies(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createProtectedPathRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).get(
    '/protected',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_ny4wur']
      const api: CookiesApi = response.locals['__oats_api_ny4wur']
      try {
        const cookies = await adapter.getCookieParameters(toolkit, protectedPathCookieDeserializer)
        const typedRequest: ProtectedPathServerRequest = {
          cookies,
        }
        const typedResponse = await api.protectedPath(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, undefined),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
          cookies: await adapter.getResponseCookies(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}