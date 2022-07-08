import { ParameterType } from '../../../types'

export type QuerySuccessData<Data extends ParameterType> = [Data, string]
export type QueryErrorData = [string]

export type QueryTestData<Data extends ParameterType> = {
  data: QuerySuccessData<Data>[]
  error: QueryErrorData[]
}
