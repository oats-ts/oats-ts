import { ParameterObject, RawHeaders } from '../../types'

export type HeaderSuccessData<Data extends ParameterObject> = [Data, RawHeaders]
export type HeaderErrorData = [RawHeaders]

export type HeaderTestData<Data extends ParameterObject> = {
  data: HeaderSuccessData<Data>[]
  error: HeaderErrorData[]
}

export function h(value: string): RawHeaders {
  return { value }
}
