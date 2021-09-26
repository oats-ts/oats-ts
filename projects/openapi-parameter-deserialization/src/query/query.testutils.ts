import { createQueryParser, QueryDeserializers, QueryOptions } from '..'
import { ParameterObject } from '../types'

type QuerySuccessData<Data extends ParameterObject> = [Data, string, QueryDeserializers<Data>]
type ErrorData<Data extends ParameterObject> = [string, QueryDeserializers<Data>]

export type QueryTestData<Data extends ParameterObject> = {
  data: QuerySuccessData<Data>[]
  error: ErrorData<Data>[]
}

export const createQueryParserTest = <Data extends ParameterObject>(name: string, data: QueryTestData<Data>): void => {
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)(
        'should be "%s", given url: %s, config %s',
        (expected: Data, url: string, config: QueryDeserializers<Data>) => {
          const parser = createQueryParser(config)
          expect(parser(url)).toEqual(expected)
        },
      )
    }
    if (data.error.length > 0) {
      it.each(data.error)('should throw, given url: %s, config %s', (url: string, config: QueryDeserializers<Data>) => {
        const parser = createQueryParser(config)
        expect(() => parser(url)).toThrowError()
      })
    }
  })
}
