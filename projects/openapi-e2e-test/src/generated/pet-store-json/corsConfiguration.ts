/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-json.json (originating from oats-ts/oats-schemas)
 */

import { CorsConfiguration } from '@oats-ts/openapi-runtime'

export const swaggerPetstoreJsonCorsConfiguration: CorsConfiguration = {
  '/pets': {
    get: {
      allowedOrigins: true,
      allowedRequestHeaders: [],
      allowedResponseHeaders: ['x-next', 'content-type'],
      allowCredentials: false,
      maxAge: undefined,
    },
    post: {
      allowedOrigins: true,
      allowedRequestHeaders: ['content-type'],
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
      maxAge: undefined,
    },
  },
  '/pets/{petId}': {
    get: {
      allowedOrigins: true,
      allowedRequestHeaders: [],
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
      maxAge: undefined,
    },
  },
}
