import { QueryOptions, ParameterValue, PathOptions } from './types'

export type QueryTestDataInput = [string[], QueryOptions<any>, string, ParameterValue]
export type QueryTestErrorInput = [QueryOptions<any>, string, ParameterValue]

export type QueryTestData = {
  data: QueryTestDataInput[]
  error: QueryTestErrorInput[]
}

export type PathTestDataInput = [string, PathOptions<any>, string, ParameterValue]
export type PathTestErrorInput = [PathOptions<any>, string, ParameterValue]

export type PathTestData = {
  data: PathTestDataInput[]
  error: PathTestErrorInput[]
}
