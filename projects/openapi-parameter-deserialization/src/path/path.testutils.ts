import { pathToRegexp } from 'path-to-regexp'
import { createPathDeserializer } from './createPathDeserializer'
import { ParameterObject, PathDeserializers } from '../types'
import { TestDataObject, TypesObject } from '../testTypes'

export type PathSuccessData<Data extends ParameterObject> = [Data, string]
export type PathErrorData = [string]

export type PathTestData<Data extends ParameterObject> = {
  data: PathSuccessData<Data>[]
  error: PathErrorData[]
}

export const createPathParserTest = <Data extends ParameterObject>(
  name: string,
  names: string[],
  regexp: RegExp,
  config?: PathDeserializers<Data>,
  data?: PathTestData<Data>,
): void => {
  if (config === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    if (data.data.length > 0) {
      it.each(data.data)('should parse to %j, given path: %j', (expected: Data, url: string) => {
        const parser = createPathDeserializer(names, regexp, config)
        const [issues, data] = parser(url)
        expect(issues).toEqual([])
        expect(data).toEqual(expected)
      })
    }
    if (data.error.length > 0) {
      it.each(data.error)('should produce issues, given path: %j', (url: string) => {
        const parser = createPathDeserializer(names, regexp, config)
        const [issues, data] = parser(url)
        expect(issues).not.toHaveLength(0)
        expect(data).toBe(undefined)
      })
    }
  })
}

const REGEXP = pathToRegexp('/test/:value/stuff')
const NAMES = ['value']

export function p(value: string): string {
  return `/test/${value}/stuff`
}

export const createTestsForPossibleTypes = (
  name: string,
  parsers: TypesObject<PathDeserializers<any>>,
  data: TypesObject<PathTestData<any>>,
): void => {
  describe(name, () => {
    createPathParserTest(`${name}.string`, NAMES, REGEXP, parsers?.string, data?.string)
    createPathParserTest(`${name}.number`, NAMES, REGEXP, parsers?.number, data?.number)
    createPathParserTest(`${name}.boolean`, NAMES, REGEXP, parsers?.boolean, data?.boolean)
    createPathParserTest(`${name}.literal`, NAMES, REGEXP, parsers?.literal, data?.literal)
    createPathParserTest(`${name}.enumeration`, NAMES, REGEXP, parsers?.enumeration, data?.enumeration)
    createPathParserTest(`${name}.array.string`, NAMES, REGEXP, parsers?.array?.string, data?.array?.string)
    createPathParserTest(`${name}.array.number`, NAMES, REGEXP, parsers?.array?.number, data?.array?.number)
    createPathParserTest(`${name}.array.boolean`, NAMES, REGEXP, parsers?.array?.boolean, data?.array?.boolean)
    createPathParserTest(`${name}.array.literal`, NAMES, REGEXP, parsers?.array?.literal, data?.array?.literal)
    createPathParserTest(
      `${name}.array.enumeration`,
      NAMES,
      REGEXP,
      parsers?.array?.enumeration,
      data?.array?.enumeration,
    )
    createPathParserTest(
      `${name}.object.requiredFields`,
      NAMES,
      REGEXP,
      parsers?.object?.requiredFields,
      data?.object?.requiredFields,
    )
    createPathParserTest(
      `${name}.object.optionalFields`,
      NAMES,
      REGEXP,
      parsers?.object?.optionalFields,
      data?.object?.optionalFields,
    )
  })
}

export const createPathTestSuite = (
  name: string,
  parsers: TestDataObject<PathDeserializers<any>>,
  data: TestDataObject<PathTestData<any>>,
): void => {
  describe(name, () => {
    createTestsForPossibleTypes(`${name}.explode.required`, parsers?.explode?.required, data?.explode?.required)
    createTestsForPossibleTypes(`${name}.explode.optional`, parsers?.explode?.optional, data?.explode?.optional)
    createTestsForPossibleTypes(`${name}.noExplode.required`, parsers?.noExplode?.required, data?.noExplode?.required)
    createTestsForPossibleTypes(`${name}.noExplode.optional`, parsers?.noExplode?.required, data?.noExplode?.required)
  })
}
