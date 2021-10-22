import { createHeaderSerializer, header } from '@oats-ts/openapi-parameter-serialization'
import { GetWithHeaderParamsRequestHeaderParameters } from '../requestHeaderTypes/GetWithHeaderParamsRequestHeaderParameters'

export const getWithHeaderParamsRequestHeadersSerializer =
  createHeaderSerializer<GetWithHeaderParamsRequestHeaderParameters>({
    'X-String-In-Headers': header.simple.primitive({ required: true }),
    'X-Number-In-Headers': header.simple.primitive({ required: true }),
    'X-Boolean-In-Headers': header.simple.primitive({ required: true }),
    'X-Enum-In-Headers': header.simple.primitive({ required: true }),
    'X-Object-In-Headers': header.simple.object({ required: true }),
    'X-Array-In-Headers': header.simple.array({ required: true }),
  })
