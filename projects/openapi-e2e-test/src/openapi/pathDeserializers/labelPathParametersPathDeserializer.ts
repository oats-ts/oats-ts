import { createPathParser, path, value } from '@oats-ts/openapi-parameter-deserialization'
import { LabelPathParametersPathParameters } from '../pathTypes/LabelPathParametersPathParameters'
import { SimpleEnum } from '../types/SimpleEnum'

export const labelPathParametersPathDeserializer = createPathParser<LabelPathParametersPathParameters>(
  ['s', 'se', 'n', 'ne', 'b', 'be', 'e', 'ee', 'a', 'ae', 'o', 'oe'],
  /^\/label-path-params(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  {
    s: path.label.primitive(value.string(), {}),
    se: path.label.primitive(value.string(), { explode: true }),
    n: path.label.primitive(value.number(), {}),
    ne: path.label.primitive(value.number(), { explode: true }),
    b: path.label.primitive(value.boolean(), {}),
    be: path.label.primitive(value.boolean(), { explode: true }),
    e: path.label.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), {}),
    ee: path.label.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), { explode: true }),
    a: path.label.array(value.number(), {}),
    ae: path.label.array(value.number(), { explode: true }),
    o: path.label.object(
      {
        s: value.string(),
        n: value.number(),
        b: value.boolean(),
        e: value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])),
      },
      {},
    ),
    oe: path.label.object(
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
