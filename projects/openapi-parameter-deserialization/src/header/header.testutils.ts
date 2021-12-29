import { createHeaderDeserializer } from './createHeaderDeserializer'
import { ParameterObject, HeaderDeserializers, RawHeaders } from '../types'
import { TestDataObject, TypesObject } from '../testTypes'

export type HeaderSuccessData<Data extends ParameterObject> = [Data, RawHeaders]
export type HeaderErrorData = [RawHeaders]

export type HeaderTestData<Data extends ParameterObject> = {
  data: HeaderSuccessData<Data>[]
  error: HeaderErrorData[]
}

export function h(value: string): RawHeaders {
  return { value }
}

export const createHeaderParserTest = <Data extends ParameterObject>(
  name: string,
  config?: HeaderDeserializers<Data>,
  data?: HeaderTestData<Data>,
): void => {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given headers: %j', (expected: Data, url: RawHeaders) => {
        const parser = createHeaderDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).toEqual([])
        expect(data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given headers: %j', (url: RawHeaders) => {
        const parser = createHeaderDeserializer(config)
        const [issues, data] = parser(url)
        expect(issues).not.toHaveLength(0)
        expect(data).toBe(undefined)
      })
    }
  })
}

export const createTestsForPossibleTypes = (
  name: string,
  parsers: TypesObject<HeaderDeserializers<any>>,
  data: TypesObject<HeaderTestData<any>>,
): void => {
  describe(name, () => {
    createHeaderParserTest(`string`, parsers?.string, data?.string)
    createHeaderParserTest(`number`, parsers?.number, data?.number)
    createHeaderParserTest(`boolean`, parsers?.boolean, data?.boolean)
    createHeaderParserTest(`literal`, parsers?.literal, data?.literal)
    createHeaderParserTest(`enumeration`, parsers?.enumeration, data?.enumeration)
    createHeaderParserTest(`array.string`, parsers?.array?.string, data?.array?.string)
    createHeaderParserTest(`array.number`, parsers?.array?.number, data?.array?.number)
    createHeaderParserTest(`array.boolean`, parsers?.array?.boolean, data?.array?.boolean)
    createHeaderParserTest(`array.literal`, parsers?.array?.literal, data?.array?.literal)
    createHeaderParserTest(`array.enumeration`, parsers?.array?.enumeration, data?.array?.enumeration)
    createHeaderParserTest(`object.requiredFields`, parsers?.object?.requiredFields, data?.object?.requiredFields)
    createHeaderParserTest(`object.optionalFields`, parsers?.object?.optionalFields, data?.object?.optionalFields)
  })
}

export const createHeaderTestSuite = (
  name: string,
  parsers: TestDataObject<HeaderDeserializers<any>>,
  data: TestDataObject<HeaderTestData<any>>,
): void => {
  describe(name, () => {
    if (parsers.explode !== undefined) {
      describe('explode', () => {
        createTestsForPossibleTypes(`required`, parsers?.explode?.required, data?.explode?.required)
        createTestsForPossibleTypes(`optional`, parsers?.explode?.optional, data?.explode?.optional)
      })
    }
    if (parsers.noExplode !== undefined) {
      describe('noExplode', () => {
        createTestsForPossibleTypes(`required`, parsers?.noExplode?.required, data?.noExplode?.required)
        createTestsForPossibleTypes(`optional`, parsers?.noExplode?.required, data?.noExplode?.required)
      })
    }
  })
}
