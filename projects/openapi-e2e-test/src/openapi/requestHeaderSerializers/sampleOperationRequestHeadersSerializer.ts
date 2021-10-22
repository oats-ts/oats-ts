import { createHeaderSerializer, header } from '@oats-ts/openapi-parameter-serialization'
import { SampleOperationRequestHeaderParameters } from '../requestHeaderTypes/SampleOperationRequestHeaderParameters'

export const sampleOperationRequestHeadersSerializer = createHeaderSerializer<SampleOperationRequestHeaderParameters>({
  'X-Header-Param': header.simple.primitive({ required: true }),
})
