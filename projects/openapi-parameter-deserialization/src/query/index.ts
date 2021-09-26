import { createQueryParser } from './createQueryParser'
import { queryDelimitedArray } from './queryDelmitedArray'
import { queryFormObject } from './queryFormObject'
import { queryFormPrimitive } from './queryFormPrimitive'
import {
  queryNumberParser,
  queryStringParser,
  queryBooleanParser,
  queryEnumerationParser,
  queryLiteralParser,
  queryIdentityParser,
  queryOptionalParser,
} from './queryPrimitiveParsers'

export const query = {
  number: queryNumberParser,
  boolean: queryBooleanParser,
  string: queryStringParser,
  enumeration: queryEnumerationParser,
  literal: queryLiteralParser,
  identity: queryIdentityParser,
  optional: queryOptionalParser,
  form: {
    array: queryDelimitedArray(','),
    object: queryFormObject,
    primitive: queryFormPrimitive,
  },
  spaceDelimited: {
    array: queryDelimitedArray(encodeURIComponent(' ')),
  },
  pipeDelimited: {
    array: queryDelimitedArray('|'),
  },
  deepObject: {
    // object: queryDeepObjectObject,
  },
}
