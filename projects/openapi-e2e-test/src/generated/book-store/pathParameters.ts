/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/book-store.json (originating from oats-ts/oats-schemas)
 */

import { PathParameters, parameter, parsePathToMatcher, parsePathToSegments } from '@oats-ts/openapi-runtime'
import { GetBookPathParameters } from './pathTypes'

export const getBookPathParameters: PathParameters<GetBookPathParameters> = {
  descriptor: { bookId: parameter.path.simple.required.primitive(parameter.value.number()) },
  matcher: parsePathToMatcher('/books/{bookId}'),
  pathSegments: parsePathToSegments('/books/{bookId}'),
}