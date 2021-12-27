import { Primitive, ValueParser } from '../types'

export type ValueSuccessData<Input extends Primitive, Output extends Primitive> = [Output, Input]
export type ValueErrorData<Input extends Primitive> = [Input]

export type ValueTestData<Input extends Primitive, Output extends Primitive> = {
  data: ValueSuccessData<Input, Output>[]
  error: ValueErrorData<Input>[]
}

export const createValueParserTest = <Input extends Primitive, Output extends Primitive>(
  name: string,
  data: ValueTestData<Input, Output>,
  parser: ValueParser<Input, Output>,
): void => {
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given input: %j', (expected: Output, input: Input) => {
        const [issues, value] = parser('test', input)
        expect(value).toEqual(expected)
        expect(issues).toEqual([])
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should throw, given input: %j', (input: Input) => {
        const [issues, value] = parser('test', input)
        expect(value).toEqual(undefined)
        expect(issues).not.toHaveLength(0)
      })
    }
  })
}
