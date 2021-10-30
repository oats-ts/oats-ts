import { createHeaderParser, header } from '@oats-ts/openapi-parameter-serialization'

export const sampleOperationResponseHeadersDeserializer = {
  200: createHeaderParser<SampleOperation200ResponseHeaderParameters>({
    'X-Test-Response-Headers': header.simple.primitive(value.string(), { required: true }),
  }),
} as const
