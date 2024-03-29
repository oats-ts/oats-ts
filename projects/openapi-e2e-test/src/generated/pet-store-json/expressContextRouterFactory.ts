/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-json.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { SwaggerPetstoreJsonApi } from './apiType'

export function createSwaggerPetstoreJsonContextRouter(
  _local_router: IRouter | undefined,
  _local_api: SwaggerPetstoreJsonApi,
  _local_adapter: ServerAdapter<ExpressToolkit>,
): IRouter {
  return (_local_router ?? Router()).use((_local__: Request, _local_response: Response, _local_next: NextFunction) => {
    _local_response.locals['_local___oats_api_84oaoa'] = _local_api
    _local_response.locals['_local___oats_adapter_84oaoa'] = _local_adapter
    _local_next()
  })
}
