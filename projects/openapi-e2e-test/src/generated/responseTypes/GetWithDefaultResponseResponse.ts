import { HttpResponse, StatusCode } from '@oats-ts/http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetWithDefaultResponseResponse = HttpResponse<NamedSimpleObject, StatusCode>
