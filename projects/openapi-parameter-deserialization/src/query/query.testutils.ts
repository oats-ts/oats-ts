import { createQueryDeserializer } from './createQueryDeserializer'
import { ParameterObject, QueryDeserializers } from '../types'
import { TestDataObject, TypesObject } from '../testTypes'

export type QuerySuccessData<Data extends ParameterObject> = [Data, string]
export type QueryErrorData = [string]

export type QueryTestData<Data extends ParameterObject> = {
  data: QuerySuccessData<Data>[]
  error: QueryErrorData[]
}

export const createQueryParserTest = <Data extends ParameterObject>(
  name: string,
  config?: QueryDeserializers<Data>,
  data?: QueryTestData<Data>,
): void => {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given query: %j', (expected: Data, url: string) => {
        const parser = createQueryDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).toEqual([])
        expect(data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given query: %j', (url: string) => {
        const parser = createQueryDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).not.toHaveLength(0)
        expect(data).toBe(undefined)
      })
    }
  })
}

export const createTestsForPossibleTypes = (
  name: string,
  parsers: TypesObject<QueryDeserializers<any>>,
  data: TypesObject<QueryTestData<any>>,
): void => {
  describe(name, () => {
    createQueryParserTest(`${name}.string`, parsers?.string, data?.string)
    createQueryParserTest(`${name}.number`, parsers?.number, data?.number)
    createQueryParserTest(`${name}.boolean`, parsers?.boolean, data?.boolean)
    createQueryParserTest(`${name}.literal`, parsers?.literal, data?.literal)
    createQueryParserTest(`${name}.enumeration`, parsers?.enumeration, data?.enumeration)
    createQueryParserTest(`${name}.array.string`, parsers?.array?.string, data?.array?.string)
    createQueryParserTest(`${name}.array.number`, parsers?.array?.number, data?.array?.number)
    createQueryParserTest(`${name}.array.boolean`, parsers?.array?.boolean, data?.array?.boolean)
    createQueryParserTest(`${name}.array.literal`, parsers?.array?.literal, data?.array?.literal)
    createQueryParserTest(`${name}.array.enumeration`, parsers?.array?.enumeration, data?.array?.enumeration)
    createQueryParserTest(
      `${name}.object.requiredFields`,
      parsers?.object?.requiredFields,
      data?.object?.requiredFields,
    )
    createQueryParserTest(
      `${name}.object.optionalFields`,
      parsers?.object?.optionalFields,
      data?.object?.optionalFields,
    )
  })
}

export const createTestSuite = (
  name: string,
  parsers: TestDataObject<QueryDeserializers<any>>,
  data: TestDataObject<QueryTestData<any>>,
): void => {
  describe(name, () => {
    createTestsForPossibleTypes(`${name}.explode.required`, parsers?.explode?.required, data?.explode?.required)
    createTestsForPossibleTypes(`${name}.explode.optional`, parsers?.explode?.optional, data?.explode?.optional)
    createTestsForPossibleTypes(`${name}.noExplode.required`, parsers?.noExplode?.required, data?.noExplode?.required)
    createTestsForPossibleTypes(`${name}.noExplode.optional`, parsers?.noExplode?.required, data?.noExplode?.required)
  })
}
