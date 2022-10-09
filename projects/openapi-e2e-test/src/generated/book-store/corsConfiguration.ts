/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { CorsConfiguration } from '@oats-ts/openapi-http'

export const bookStoreCorsConfiguration: CorsConfiguration = {
  '/books': {
    get: {
      allowedOrigins: true,
      allowedRequestHeaders: ['x-limit'],
      allowedResponseHeaders: ['x-length', 'content-type'],
      allowCredentials: false,
    },
    post: {
      allowedOrigins: true,
      allowedRequestHeaders: ['content-type'],
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
  '/books/{bookId}': {
    get: {
      allowedOrigins: true,
      allowedResponseHeaders: ['content-type'],
      allowCredentials: false,
    },
  },
}