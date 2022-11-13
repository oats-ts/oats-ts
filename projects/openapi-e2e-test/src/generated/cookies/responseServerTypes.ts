/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/cookies.json (originating from oats-ts/oats-schemas)
 */

import { SetCookieValue } from '@oats-ts/openapi-runtime'

export type LoginServerResponse =
  | {
      statusCode: 200
      cookies?: SetCookieValue[]
    }
  | {
      statusCode: 401
      cookies?: SetCookieValue[]
    }

export type ProtectedPathServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: {
        name: string
      }
      cookies?: SetCookieValue[]
    }
  | {
      statusCode: 401
      cookies?: SetCookieValue[]
    }
