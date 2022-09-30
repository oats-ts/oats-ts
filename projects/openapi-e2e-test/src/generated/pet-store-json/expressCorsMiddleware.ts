/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/pet-store-json.json
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter } from '@oats-ts/openapi-http'
import { NextFunction, Request, Response, Router } from 'express'

export const swaggerPetstoreCorsMiddleware: Router = Router()
  .options('/pets/:petId', async (request: Request, response: Response, next: NextFunction) => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    try {
      await adapter.respond(toolkit, {
        headers: await adapter.getPreflightCorsHeaders(toolkit, {
          allowedOrigins: { get: true },
          allowedMethods: ['get'],
          allowedResponseHeaders: { get: ['content-type'] },
          allowCredentials: { get: false },
        }),
      })
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })
  .options('/pets', async (request: Request, response: Response, next: NextFunction) => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    try {
      await adapter.respond(toolkit, {
        headers: await adapter.getPreflightCorsHeaders(toolkit, {
          allowedOrigins: { get: true, post: true },
          allowedMethods: ['get', 'post'],
          allowedRequestHeaders: { post: ['content-type'] },
          allowedResponseHeaders: { get: ['x-next', 'content-type'], post: ['content-type'] },
          allowCredentials: { get: false, post: false },
        }),
      })
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  })
