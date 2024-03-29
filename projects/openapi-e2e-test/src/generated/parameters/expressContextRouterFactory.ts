/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/parameters.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit as _ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter as _ServerAdapter } from '@oats-ts/openapi-runtime'
import {
  IRouter as _IRouter,
  NextFunction as _NextFunction,
  Request as _Request,
  Response as _Response,
  Router as _Router,
} from 'express'
import { ParametersApi } from './apiType'

export function createParametersContextRouter(
  router: _IRouter | undefined,
  api: ParametersApi,
  adapter: _ServerAdapter<_ExpressToolkit>,
): _IRouter {
  return (router ?? _Router()).use((_: _Request, response: _Response, next: _NextFunction) => {
    response.locals['__oats_api_15nbq9j'] = api
    response.locals['__oats_adapter_15nbq9j'] = adapter
    next()
  })
}
