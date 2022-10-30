/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/book-store.json
 */

import { deserializers, dsl } from '@oats-ts/openapi-runtime'
import { GetBookPathParameters } from './pathTypes'

export const getBookPathDeserializer = deserializers.createPathDeserializer<GetBookPathParameters>(
  { bookId: dsl.path.simple.primitive(dsl.value.number()) },
  ['bookId'],
  /^\/books(?:\/([^\/#\?]+?))[\/#\?]?$/i,
)
