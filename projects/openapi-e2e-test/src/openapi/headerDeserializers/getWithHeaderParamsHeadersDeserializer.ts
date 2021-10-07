import { createHeaderParser, header, value } from '@oats-ts/openapi-parameter-deserialization'
import { GetWithHeaderParamsHeaderParameters } from '../headerTypes/GetWithHeaderParamsHeaderParameters'

export const getWithHeaderParamsHeadersDeserializer = createHeaderParser<GetWithHeaderParamsHeaderParameters>({
  'X-String-In-Headers': header.simple.primitive(value.string(), { required: true }),
  'X-Number-In-Headers': header.simple.primitive(value.number(), { required: true }),
  'X-Boolean-In-Headers': header.simple.primitive(value.boolean(), { required: true }),
  'X-Enum-In-Headers': header.simple.primitive(value.string(value.enumeration(['bear', 'racoon', 'cat'])), {
    required: true,
  }),
  'X-Object-In-Headers': header.simple.object(
    {
      stringProperty: value.string(),
      optionalStringProperty: value.optional(value.string()),
      numberProperty: value.number(),
      optionalNumberProperty: value.optional(value.number()),
      booleanProperty: value.boolean(),
      optionalBooleanProperty: value.optional(value.boolean()),
    },
    { required: true },
  ),
  'X-Array-In-Headers': header.simple.array(value.string(), { required: true }),
})
