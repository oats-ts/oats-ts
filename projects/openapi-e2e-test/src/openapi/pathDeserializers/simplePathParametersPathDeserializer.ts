import { createPathParser, path, value } from '@oats-ts/openapi-parameter-deserialization'
import { SimplePathParametersPathParameters } from '../pathTypes/SimplePathParametersPathParameters'
import { SimpleEnum } from '../types/SimpleEnum'

export const simplePathParametersPathDeserializer = createPathParser<SimplePathParametersPathParameters>(
  ['s', 'se', 'n', 'ne', 'b', 'be', 'e', 'ee', 'a', 'ae', 'o', 'oe'],
  /^\/simple-path-params(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  {
    s: path.simple.primitive(value.string(), {}),
    se: path.simple.primitive(value.string(), { explode: true }),
    n: path.simple.primitive(value.number(), {}),
    ne: path.simple.primitive(value.number(), { explode: true }),
    b: path.simple.primitive(value.boolean(), {}),
    be: path.simple.primitive(value.boolean(), { explode: true }),
    e: path.simple.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), {}),
    ee: path.simple.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), { explode: true }),
    a: path.simple.array(value.number(), {}),
    ae: path.simple.array(value.number(), { explode: true }),
    o: path.simple.object(
      {
        s: value.string(),
        n: value.number(),
        b: value.boolean(),
        e: value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])),
      },
      {},
    ),
    oe: path.simple.object(
      {
        s: value.string(),
        n: value.number(),
        b: value.boolean(),
        e: value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])),
      },
      { explode: true },
    ),
  },
)
