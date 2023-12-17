/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/bodies.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { BodiesApi } from './apiType'

export function createBodiesContextRouter(
  router: IRouter | undefined,
  api: BodiesApi,
  adapter: ServerAdapter<ExpressToolkit>,
): IRouter {
  return (router ?? Router()).use((_: Request, response: Response, next: NextFunction) => {
    response.locals['__oats_api_1qzwl9e'] = api
    response.locals['__oats_adapter_1qzwl9e'] = adapter
    next()
  })
}
