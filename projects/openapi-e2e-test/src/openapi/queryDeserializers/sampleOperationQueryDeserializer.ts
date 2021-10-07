import { createQueryParser, query, value } from '@oats-ts/openapi-parameter-deserialization'
import { SampleOperationQueryParameters } from '../queryTypes/SampleOperationQueryParameters'

export const sampleOperationQueryDeserializer = createQueryParser<SampleOperationQueryParameters>({
  queryParam: query.form.primitive(value.string(), { required: true }),
})
