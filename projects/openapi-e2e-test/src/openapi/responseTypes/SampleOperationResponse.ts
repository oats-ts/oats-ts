import { HttpResponse } from '@oats-ts/openapi-http'
import { NamedComplexObject } from '../types/NamedComplexObject'

export type SampleOperationResponse =
  | HttpResponse<NamedComplexObject, 200, 'application/json', Record<string, any>>
  | HttpResponse<string, 201, 'text/plain', Record<string, any>>
