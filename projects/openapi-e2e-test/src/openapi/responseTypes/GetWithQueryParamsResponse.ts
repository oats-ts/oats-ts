import { HttpResponse } from '@oats-ts/openapi-http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithQueryParamsResponse = HttpResponse<NamedSimpleObject, 200, 'application/json', undefined>
