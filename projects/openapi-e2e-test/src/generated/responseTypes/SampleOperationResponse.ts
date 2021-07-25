import { HttpResponse } from '@oats-ts/http'
import { NamedComplexObject } from '../types/NamedComplexObject'

export type SampleOperationResponse = HttpResponse<NamedComplexObject, 200> | HttpResponse<string, 201>
