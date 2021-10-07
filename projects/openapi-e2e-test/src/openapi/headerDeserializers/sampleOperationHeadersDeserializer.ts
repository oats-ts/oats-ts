import { createHeaderParser, header, value } from '@oats-ts/openapi-parameter-deserialization'
import { SampleOperationHeaderParameters } from '../headerTypes/SampleOperationHeaderParameters'

export const sampleOperationHeadersDeserializer = createHeaderParser<SampleOperationHeaderParameters>({
  'X-Header-Param': header.simple.primitive(value.string(), { required: true }),
})
