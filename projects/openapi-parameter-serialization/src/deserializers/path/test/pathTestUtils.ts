import { ParameterObject } from '../../types'

export type PathSuccessData<Data extends ParameterObject> = [Data, string]
export type PathErrorData = [string]

export type PathTestData<Data extends ParameterObject> = {
  data: PathSuccessData<Data>[]
  error: PathErrorData[]
}

export function p(value: string): string {
  return `/test/${value}/stuff`
}
