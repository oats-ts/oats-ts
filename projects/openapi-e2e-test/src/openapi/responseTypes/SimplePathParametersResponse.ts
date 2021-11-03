import { HttpResponse } from '@oats-ts/openapi-http'
import { SimpleObject } from '../types/SimpleObject'

export type SimplePathParametersResponse = HttpResponse<SimpleObject, 200, 'application/json', undefined>
