import { createHeaderSerializer, header } from '@oats-ts/openapi-parameter-serialization'
import { SampleOperation200ResponseHeaderParameters } from '../responseHeaderTypes/SampleOperation200ResponseHeaderParameters'

export const sampleOperationResponseHeaderSerializer = {
  200: createHeaderSerializer<SampleOperation200ResponseHeaderParameters>({
    'X-Test-Response-Headers': header.simple.primitive({ required: true }),
  }),
} as const
