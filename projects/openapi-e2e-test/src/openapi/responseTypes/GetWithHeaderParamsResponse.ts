import { HttpResponse } from '@oats-ts/openapi-http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithHeaderParamsResponse = HttpResponse<NamedSimpleObject, 200, 'application/json'>
