/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/optional-request-body.json
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { OptionalBodiesApi } from './apiType'

export function createOptionalBodiesContextRouter(
  router: IRouter | undefined,
  api: OptionalBodiesApi,
  adapter: ServerAdapter<ExpressToolkit>,
): IRouter {
  return (router ?? Router()).use((_: Request, response: Response, next: NextFunction) => {
    response.locals['__oats_api_132nvbh'] = api
    response.locals['__oats_adapter_132nvbh'] = adapter
    next()
  })
}
