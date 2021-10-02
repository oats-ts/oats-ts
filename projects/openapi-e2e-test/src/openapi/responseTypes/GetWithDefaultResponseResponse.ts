import { HttpResponse, StatusCode } from '@oats-ts/openapi-http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithDefaultResponseResponse = HttpResponse<NamedSimpleObject, StatusCode, 'application/json', undefined>
