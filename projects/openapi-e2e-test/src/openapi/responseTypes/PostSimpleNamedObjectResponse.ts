import { HttpResponse } from '@oats-ts/http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type PostSimpleNamedObjectResponse = HttpResponse<NamedSimpleObject, 200, 'application/json'>
