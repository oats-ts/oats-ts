import { HttpResponse } from '@oats-ts/openapi-http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type PostSimpleNamedObjectResponse = HttpResponse<
  NamedSimpleObject,
  200,
  'application/json',
  Record<string, any>
>
