import { QueryOptions, ParameterValue, PathOptions, HeaderOptions } from './types'

export type SerialzerCreator<Result, Options> = (options: Options) => (name: string, data: ParameterValue) => Result

export type TestDataInput<Result, Options> = [Result, Options, string, ParameterValue]
export type TestErrorInput<Options> = [Options, string, ParameterValue]
export type TestData<Result, Options> = {
  data: TestDataInput<Result, Options>[]
  error: TestErrorInput<Options>[]
}

export type QueryTestDataInput = TestDataInput<string[], QueryOptions<any>>
export type QueryTestErrorInput = TestErrorInput<QueryOptions<any>>
export type QueryTestData = TestData<string[], QueryOptions<any>>

export type PathTestDataInput = TestDataInput<string, PathOptions<any>>
export type PathTestErrorInput = TestErrorInput<PathOptions<any>>
export type PathTestData = TestData<string, PathOptions<any>>

export type HeaderTestDataInput = TestDataInput<string, HeaderOptions<any>>
export type HeaderTestErrorInput = TestErrorInput<HeaderOptions<any>>
export type HeaderTestData = TestData<string, HeaderOptions<any>>

export function createSerializerTest<Result, Options>(
  name: string,
  data: TestData<Result, Options>,
  fn: SerialzerCreator<Result, Options>,
): void {
  describe(name, () => {
    it.each(data.data)('should be "%s", given options: %s, name %s, value: %s', (expected, options, name, value) => {
      expect(fn(options)(name, value)).toEqual(expected)
    })
    it.each(data.error)('should throw, given options: %s, name %s, value: %s', (options, name, value) => {
      expect(() => fn(options)(name, value)).toThrowError()
    })
  })
}
