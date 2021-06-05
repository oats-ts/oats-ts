import { Options, ParameterValue } from './types'
//                                expected    options      name       value
export type QueryTestDataInput = [string[], Options<any>, string, ParameterValue]

export type QueryTestErrorInput = [Options<any>, string, ParameterValue]

export type TestData = {
  data: QueryTestDataInput[]
  error: QueryTestErrorInput[]
}
