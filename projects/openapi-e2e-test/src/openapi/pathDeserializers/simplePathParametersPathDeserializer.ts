import { createPathParser, path, value } from '@oats-ts/openapi-parameter-deserialization'
import { SimplePathParametersPathParameters } from '../pathTypes/SimplePathParametersPathParameters'
import { SimpleEnum } from '../types/SimpleEnum'

export const simplePathParametersPathDeserializer = createPathParser<SimplePathParametersPathParameters>(
  ['s', 'n', 'b', 'e', 'a', 'o', 'oe'],
  /(?:^\/simple-path-params\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$)/,
  {
    s: path.simple.primitive(value.string(), {}),
    n: path.simple.primitive(value.number(), {}),
    b: path.simple.primitive(value.boolean(), {}),
    e: path.simple.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), {}),
    a: path.simple.array(value.number(), {}),
    o: path.simple.object(
      {
        s: value.optional(value.string()),
        n: value.optional(value.number()),
        b: value.optional(value.boolean()),
        e: value.optional(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C']))),
      },
      {},
    ),
    oe: path.simple.object(
      {
        s: value.optional(value.string()),
        n: value.optional(value.number()),
        b: value.optional(value.boolean()),
        e: value.optional(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C']))),
      },
      { explode: true },
    ),
  },
)
