/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/cookies.json (originating from oats-ts/oats-schemas)
 */

import { Try } from '@oats-ts/openapi-runtime'
import { ProtectedPathCookieParameters } from './cookieTypes'

export type LoginServerRequest = {
  mimeType: 'application/json'
  body: Try<{
    name: string
  }>
}

export type ProtectedPathServerRequest = {
  cookies: Try<ProtectedPathCookieParameters>
}
