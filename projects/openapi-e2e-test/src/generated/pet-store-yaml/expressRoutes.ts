/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/pet-store-yaml.yaml
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { RawHttpResponse, ServerAdapter } from '@oats-ts/openapi-http'
import { NextFunction, Request, Response, Router } from 'express'
import { SwaggerPetstoreApi } from './apiType'
import { showPetByIdPathDeserializer } from './pathDeserializers'
import { listPetsQueryDeserializer } from './queryDeserializers'
import { createPetsRequestBodyValidator } from './requestBodyValidators'
import { CreatePetsServerRequest, ListPetsServerRequest, ShowPetByIdServerRequest } from './requestServerTypes'
import { listPetsResponseHeadersSerializer } from './responseHeaderSerializers'
import { Pet } from './types'

export const createPetsRouter: Router = Router()
  .options('/pets', async (request: Request, response: Response, next: NextFunction) => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    try {
      await adapter.respond(toolkit, {
        headers: await adapter.getPreflightCorsHeaders(toolkit, {
          allowedOrigins: ['https://foo.com'],
          allowedMethods: ['get', 'post'],
          allowedRequestHeaders: { post: ['content-type'] },
          allowedResponseHeaders: { get: ['x-next', 'content-type'], post: ['content-type'] },
        }),
      })
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })
  .post('/pets', async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: SwaggerPetstoreApi = response.locals['__oats_api']
    try {
      const mimeType = await adapter.getMimeType<'application/json'>(toolkit)
      const body = await adapter.getRequestBody<'application/json', Pet>(
        toolkit,
        true,
        mimeType,
        createPetsRequestBodyValidator,
      )
      const typedRequest: CreatePetsServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.createPets(typedRequest)
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(
          toolkit,
          typedResponse,
          undefined,
          await adapter.getCorsHeaders(toolkit, {
            allowedOrigins: ['https://foo.com'],
            allowedResponseHeaders: ['content-type'],
          }),
        ),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
      }
      await adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })

export const listPetsRouter: Router = Router()
  .options('/pets', async (request: Request, response: Response, next: NextFunction) => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    try {
      await adapter.respond(toolkit, {
        headers: await adapter.getPreflightCorsHeaders(toolkit, {
          allowedOrigins: ['https://foo.com'],
          allowedMethods: ['get', 'post'],
          allowedRequestHeaders: { post: ['content-type'] },
          allowedResponseHeaders: { get: ['x-next', 'content-type'], post: ['content-type'] },
        }),
      })
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })
  .get('/pets', async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: SwaggerPetstoreApi = response.locals['__oats_api']
    try {
      const query = await adapter.getQueryParameters(toolkit, listPetsQueryDeserializer)
      const typedRequest: ListPetsServerRequest = {
        query,
      }
      const typedResponse = await api.listPets(typedRequest)
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(
          toolkit,
          typedResponse,
          listPetsResponseHeadersSerializer,
          await adapter.getCorsHeaders(toolkit, {
            allowedOrigins: ['https://foo.com'],
            allowedResponseHeaders: ['x-next', 'content-type'],
          }),
        ),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
      }
      await adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })

export const showPetByIdRouter: Router = Router()
  .options('/pets/:petId', async (request: Request, response: Response, next: NextFunction) => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    try {
      await adapter.respond(toolkit, {
        headers: await adapter.getPreflightCorsHeaders(toolkit, {
          allowedOrigins: ['https://foo.com'],
          allowedMethods: ['get'],
          allowedResponseHeaders: { get: ['content-type'] },
        }),
      })
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })
  .get('/pets/:petId', async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: SwaggerPetstoreApi = response.locals['__oats_api']
    try {
      const path = await adapter.getPathParameters(toolkit, showPetByIdPathDeserializer)
      const typedRequest: ShowPetByIdServerRequest = {
        path,
      }
      const typedResponse = await api.showPetById(typedRequest)
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(
          toolkit,
          typedResponse,
          undefined,
          await adapter.getCorsHeaders(toolkit, {
            allowedOrigins: ['https://foo.com'],
            allowedResponseHeaders: ['content-type'],
          }),
        ),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
      }
      await adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })
