import { HttpResponse } from '@oats-ts/http'
import { NamedSimpleObject } from '../types/NamedSimpleObject'

export type GetSimpleNamedObjectResponse = HttpResponse<NamedSimpleObject, 200>
