import { header, createHeaderSerializer } from '@oats-ts/openapi-parameter-serialization'
import { GetWithHeaderParamsHeaderParameters } from '../headerTypes/GetWithHeaderParamsHeaderParameters'

export const getWithHeaderParamsHeadersSerializer = createHeaderSerializer<GetWithHeaderParamsHeaderParameters>({
  'X-String-In-Headers': header.simple.primitive({ required: true }),
  'X-Number-In-Headers': header.simple.primitive({ required: true }),
  'X-Boolean-In-Headers': header.simple.primitive({ required: true }),
  'X-Enum-In-Headers': header.simple.primitive({ required: true }),
})
