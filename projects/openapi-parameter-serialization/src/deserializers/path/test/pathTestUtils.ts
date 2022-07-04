import { ParameterType } from '../../../types'

export type PathSuccessData<Data extends ParameterType> = [Data, string]
export type PathErrorData = [string]

export type PathTestData<Data extends ParameterType> = {
  data: PathSuccessData<Data>[]
  error: PathErrorData[]
}

export function p(value: string): string {
  return `/test/${value}/stuff`
}
