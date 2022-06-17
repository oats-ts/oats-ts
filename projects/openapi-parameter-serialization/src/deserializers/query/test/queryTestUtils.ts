import { ParameterObject } from '../../types'

export type QuerySuccessData<Data extends ParameterObject> = [Data, string]
export type QueryErrorData = [string]

export type QueryTestData<Data extends ParameterObject> = {
  data: QuerySuccessData<Data>[]
  error: QueryErrorData[]
}
