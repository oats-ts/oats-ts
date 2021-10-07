import { createPathParser, path, value } from '@oats-ts/openapi-parameter-deserialization'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'

export const sampleOperationPathDeserializer = createPathParser<SampleOperationPathParameters>(
  ['pathParam'],
  /(?:^\/sample\/path\/[\/#\?]?$|^([^\/#\?]+?)[\/#\?]?$)/,
  { pathParam: path.simple.primitive(value.string(), {}) },
)
