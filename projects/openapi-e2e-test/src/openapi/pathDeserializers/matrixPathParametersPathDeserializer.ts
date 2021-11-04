import { createPathParser, path, value } from '@oats-ts/openapi-parameter-deserialization'
import { MatrixPathParametersPathParameters } from '../pathTypes/MatrixPathParametersPathParameters'
import { SimpleEnum } from '../types/SimpleEnum'

export const matrixPathParametersPathDeserializer = createPathParser<MatrixPathParametersPathParameters>(
  ['s', 'se', 'n', 'ne', 'b', 'be', 'e', 'ee', 'a', 'ae', 'o', 'oe'],
  /^\/matrix-path-params(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  {
    s: path.matrix.primitive(value.string(), {}),
    se: path.matrix.primitive(value.string(), { explode: true }),
    n: path.matrix.primitive(value.number(), {}),
    ne: path.matrix.primitive(value.number(), { explode: true }),
    b: path.matrix.primitive(value.boolean(), {}),
    be: path.matrix.primitive(value.boolean(), { explode: true }),
    e: path.matrix.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), {}),
    ee: path.matrix.primitive(value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])), { explode: true }),
    a: path.matrix.array(value.number(), {}),
    ae: path.matrix.array(value.number(), { explode: true }),
    o: path.matrix.object(
      {
        s: value.string(),
        n: value.number(),
        b: value.boolean(),
        e: value.string(value.enumeration<string, SimpleEnum>(['A', 'B', 'C'])),
      },
      {},
    ),
    oe: path.matrix.object(
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
