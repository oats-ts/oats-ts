import { HttpResponse } from '@oats-ts/openapi-http'
import { NamedComplexObject } from '../types/NamedComplexObject'

export type SampleOperationResponse =
  | HttpResponse<
      NamedComplexObject,
      200,
      'application/json',
      {
        'X-Test-Response-Headers': string
      }
    >
  | HttpResponse<string, 201, 'text/plain', undefined>
