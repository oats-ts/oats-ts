import { createPathParser, path, value } from '@oats-ts/openapi-parameter-deserialization'
import { GetWithPathParamsPathParameters } from '../pathTypes/GetWithPathParamsPathParameters'

export const getWithPathParamsPathDeserializer = createPathParser<GetWithPathParamsPathParameters>(
  ['stringInPath', 'numberInPath', 'booleanInPath', 'enumInPath', 'objectInPath', 'arrayInPath'],
  /(?:^\/path-params\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$|^\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$)/,
  {
    stringInPath: path.simple.primitive(value.string(), {}),
    numberInPath: path.simple.primitive(value.number(), {}),
    booleanInPath: path.simple.primitive(value.boolean(), {}),
    enumInPath: path.simple.primitive(value.string(value.enumeration(['bear', 'racoon', 'cat'])), {}),
    objectInPath: path.simple.object(
      {
        stringProperty: value.string(),
        optionalStringProperty: value.optional(value.string()),
        numberProperty: value.number(),
        optionalNumberProperty: value.optional(value.number()),
        booleanProperty: value.boolean(),
        optionalBooleanProperty: value.optional(value.boolean()),
      },
      {},
    ),
    arrayInPath: path.simple.array(value.string(), {}),
  },
)
