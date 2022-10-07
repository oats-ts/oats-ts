/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/generated-schemas/methods.json
 */

import { CorsConfiguration } from '@oats-ts/openapi-http'

export const httpMethodsCorsConfiguration: CorsConfiguration = {
  '/get-method': {
    get: {
      allowedOrigins: true,
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
  '/post-method': {
    post: {
      allowedOrigins: true,
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
  '/put-method': {
    put: {
      allowedOrigins: true,
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
  '/patch-method': {
    patch: {
      allowedOrigins: true,
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
  '/delete-method': {
    delete: {
      allowedOrigins: true,
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
}
