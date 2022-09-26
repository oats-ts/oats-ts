/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { createPathDeserializer, dsl } from '@oats-ts/openapi-parameter-serialization'
import { GetBookPathParameters } from './pathTypes'

export const getBookPathDeserializer = createPathDeserializer<GetBookPathParameters>(
  { bookId: dsl.path.simple.primitive(dsl.value.number()) },
  ['bookId'],
  /^\/books(?:\/([^\/#\?]+?))[\/#\?]?$/i,
)