import { HttpResponse } from '@oats-ts/http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithHeaderParamsResponse = HttpResponse<NamedSimpleObject, 200, 'application/json'>
