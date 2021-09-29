import { HttpResponse } from '@oats-ts/openapi-http'
import { NamedComplexObject } from '../types/NamedComplexObject'

export type SampleOperationResponse =
  | HttpResponse<NamedComplexObject, 200, 'application/json'>
  | HttpResponse<string, 201, 'text/plain'>
