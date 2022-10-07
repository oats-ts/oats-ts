/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/pet-store-yaml.yaml
 */

import { CorsConfiguration } from '@oats-ts/openapi-http'

export const swaggerPetstoreCorsConfiguration: CorsConfiguration = {
  '/pets': {
    get: {
      allowedOrigins: ['https://foo.com'],
      allowedResponseHeaders: ['x-next', 'content-type'],
      allowCredentials: false,
    },
    post: {
      allowedOrigins: ['https://foo.com'],
      allowedRequestHeaders: ['content-type'],
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
  '/pets/{petId}': {
    get: {
      allowedOrigins: ['https://foo.com'],
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
}
