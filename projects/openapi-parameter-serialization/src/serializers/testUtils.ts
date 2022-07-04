import { Failure, Success, Try } from '@oats-ts/try'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'
import { DslConfig, ParameterValue } from '../types'

export type SerialzerCreator<Result, Options> = (
  options: Options,
) => (data: ParameterValue, name: string, path: string, config: ValidatorConfig) => Try<Result>

export type TestDataInput<Result, Options> = [Result, Options, string, ParameterValue | undefined | null]
export type TestErrorInput<Options> = [Options, string, ParameterValue | undefined | null]
export type TestData<Result, Options> = {
  data: TestDataInput<Result, Options>[]
  error: TestErrorInput<Options>[]
}

export type QueryTestDataInput = TestDataInput<string[], Partial<DslConfig>>
export type QueryTestErrorInput = TestErrorInput<Partial<DslConfig>>
export type QueryTestData = TestData<string[], Partial<DslConfig>>

export type PathTestDataInput = TestDataInput<string, Partial<DslConfig>>
export type PathTestErrorInput = TestErrorInput<Partial<DslConfig>>
export type PathTestData = TestData<string, Partial<DslConfig>>

export type HeaderTestDataInput = TestDataInput<string, Partial<DslConfig>>
export type HeaderTestErrorInput = TestErrorInput<Partial<DslConfig>>
export type HeaderTestData = TestData<string, Partial<DslConfig>>

export function createSerializerTest<Result, Options>(
  name: string,
  data: TestData<Result, Options>,
  fn: SerialzerCreator<Result, Options>,
): void {
  const config = DefaultConfig
  const location = name.split('.')[0]
  describe(name, () => {
    it.each(data.data)('should be "%s", given options: %s, name %s, value: %s', (expected, options, name, value) => {
      const result = fn(options)(value!, name, config.append(location, name), config)
      expect((result as Success<any>).data).toEqual(expected)
    })
    it.each(data.error)('should throw, given options: %s, name %s, value: %s', (options, name, value) => {
      const result = fn(options)(value!, name, config.append(location, name), config)
      expect((result as Failure).issues).not.toHaveLength(0)
    })
  })
}
