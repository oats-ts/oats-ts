import { createHeaderSerializer, header } from '@oats-ts/openapi-parameter-serialization'

export const sampleOperationResponseHeaderSerializer = {
  200: createHeaderSerializer<{
    'X-Test-Response-Headers': string
  }>({ 'X-Test-Response-Headers': header.simple.primitive({ required: true }) }),
} as const
