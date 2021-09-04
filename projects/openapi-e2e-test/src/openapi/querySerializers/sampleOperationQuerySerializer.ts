import { createQuerySerializer, query } from '@oats-ts/openapi-parameter-serialization'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'

export const sampleOperationQuerySerializer = createQuerySerializer<SampleOperationQueryParameters>({
  queryParam: query.form.primitive({ required: true }),
})
