import { createQueryDeserializer } from './createQueryDeserializer'
import { ParameterObject, QueryDeserializers } from '../types'

type QuerySuccessData<Data extends ParameterObject> = [Data, string]
type QueryErrorData = [string]

export type QueryTestData<Data extends ParameterObject> = {
  data: QuerySuccessData<Data>[]
  error: QueryErrorData[]
}

export const createQueryParserTest = <Data extends ParameterObject>(
  name: string,
  data: QueryTestData<Data>,
  config: QueryDeserializers<Data>,
): void => {
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given query: %j', (expected: Data, url: string) => {
        const parser = createQueryDeserializer(config)
        expect(parser(url)).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should throw, given query: %j', (url: string) => {
        const parser = createQueryDeserializer(config)
        expect(() => parser(url)).toThrowError()
      })
    }
  })
}
