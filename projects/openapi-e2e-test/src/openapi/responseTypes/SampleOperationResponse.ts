import { HttpResponse } from '@oats-ts/openapi-http'
import { SampleOperation200ResponseHeaderParameters } from '../responseHeaderTypes/SampleOperation200ResponseHeaderParameters'
import { NamedComplexObject } from '../types/NamedComplexObject'

export type SampleOperationResponse =
  | HttpResponse<NamedComplexObject, 200, 'application/json', SampleOperation200ResponseHeaderParameters>
  | HttpResponse<string, 201, 'text/plain', undefined>
