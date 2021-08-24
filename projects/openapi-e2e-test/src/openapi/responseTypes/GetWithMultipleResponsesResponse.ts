import { HttpResponse, StatusCode } from '@oats-ts/http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'
import { NamedDeprecatedObject } from '../types/NamedDeprecatedObject'
import { NamedComplexObject } from '../types/NamedComplexObject'

export type GetWithMultipleResponsesResponse =
  | HttpResponse<NamedSimpleObject, 200, 'application/json'>
  | HttpResponse<
      {
        test?: NamedSimpleObject
      },
      201,
      'application/json'
    >
  | HttpResponse<NamedDeprecatedObject, 205, 'application/json'>
  | HttpResponse<NamedComplexObject, Exclude<StatusCode, 200 | 201 | 205>, 'application/json'>
