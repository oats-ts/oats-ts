/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/generated-schemas/methods.json
 */

import { IRouter, Router } from 'express'

/**
 * WARNING: CORS router factory found no allowed origins for any operations, and likely needs to be configured!
 *
 * - If you don't need CORS, remove "oats/express-cors-router-factory" from your configuration.
 * - If you need CORS, please provide at least the getAllowedOrigins options for "oats/express-cors-router-factory".
 * - More info on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 * - More info on configuring generators: https://oats-ts.github.io/docs/#/docs/OpenAPI_Generate
 */
export function createHttpMethodsCorsRouter(router?: IRouter): IRouter {
  return router ?? Router()
}
