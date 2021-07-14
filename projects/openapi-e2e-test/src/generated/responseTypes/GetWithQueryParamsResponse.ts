import { HttpResponse } from '@oats-ts/http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithQueryParamsResponse = HttpResponse<NamedSimpleObject, 200>
