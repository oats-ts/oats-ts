import { HttpResponse, StatusCode } from '@oats-ts/openapi-http'
import { NamedComplexObject } from '../types/NamedComplexObject'
import { NamedDeprecatedObject } from '../types/NamedDeprecatedObject'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithMultipleResponsesResponse =
  | HttpResponse<NamedSimpleObject, 200, 'application/json', undefined>
  | HttpResponse<
      {
        test?: NamedSimpleObject
      },
      201,
      'application/json',
      undefined
    >
  | HttpResponse<NamedDeprecatedObject, 205, 'application/json', undefined>
  | HttpResponse<NamedComplexObject, Exclude<StatusCode, 200 | 201 | 205>, 'application/json', undefined>
