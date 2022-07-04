import { ParameterType, RawHeaders } from '../../../types'

export type HeaderSuccessData<Data extends ParameterType> = [Data, RawHeaders]
export type HeaderErrorData = [RawHeaders]

export type HeaderTestData<Data extends ParameterType> = {
  data: HeaderSuccessData<Data>[]
  error: HeaderErrorData[]
}

export function h(value: string): RawHeaders {
  return { value }
}
