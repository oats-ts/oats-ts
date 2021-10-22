import { createHeaderParser, header, value } from '@oats-ts/openapi-parameter-deserialization'
import { SampleOperationRequestHeaderParameters } from '../requestHeaderTypes/SampleOperationRequestHeaderParameters'

export const sampleOperationRequestHeadersDeserializer = createHeaderParser<SampleOperationRequestHeaderParameters>({
  'X-Header-Param': header.simple.primitive(value.string(), { required: true }),
})
