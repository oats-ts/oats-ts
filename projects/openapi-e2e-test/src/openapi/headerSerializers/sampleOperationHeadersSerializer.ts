import { header, createHeaderSerializer } from '@oats-ts/openapi-parameter-serialization'
import { SampleOperationHeaderParameters } from '../headerTypes/SampleOperationHeaderParameters'

export const sampleOperationHeadersSerializer = createHeaderSerializer<SampleOperationHeaderParameters>({
  'X-Header-Param': header.simple.primitive({ required: true }),
})
