import { createQueryParser, query, value } from '@oats-ts/openapi-parameter-deserialization'
import { GetWithQueryParamsQueryParameters } from '../queryTypes/GetWithQueryParamsQueryParameters'

export const getWithQueryParamsQueryDeserializer = createQueryParser<GetWithQueryParamsQueryParameters>({
  stringInQuery: query.form.primitive(value.string(), { required: true }),
  numberInQuery: query.form.primitive(value.number(), { required: true }),
  booleanInQuery: query.form.primitive(value.boolean(), { required: true }),
  enumInQuery: query.form.primitive(value.string(value.enumeration(['bear', 'racoon', 'cat'])), { required: true }),
  objectInQuery: query.form.object(
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
  arrayInQuery: query.form.array(value.string(), { required: true }),
})
