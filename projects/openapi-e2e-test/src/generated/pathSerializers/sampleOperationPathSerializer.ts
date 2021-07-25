import { path, createPathSerializer } from '@oats-ts/openapi-parameter-serialization'
import { SampleOperationPathParameters } from '../pathTypes/SampleOperationPathParameters'

export const sampleOperationPathSerializer = createPathSerializer<SampleOperationPathParameters>(
  '/sample/path/{pathParam}',
  { pathParam: path.simple.primitive({}) },
)
