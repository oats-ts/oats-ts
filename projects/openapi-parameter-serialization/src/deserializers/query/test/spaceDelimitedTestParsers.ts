import { query } from '../index'
import { QueryValueDeserializers, QueryOptions } from '../../types'
import { enumParser, stringParser, numberParser, booleanParser, literalParser } from '../../value/test/valueTestData'
import { TestDataObject, TypesObject } from '../../test/testTypes'

function createTypesParsers(config: QueryOptions): TypesObject<QueryValueDeserializers<any>> {
  return {
    array: {
      string: { value: query.spaceDelimited.array(stringParser, config) },
      number: { value: query.spaceDelimited.array(numberParser, config) },
      boolean: { value: query.spaceDelimited.array(booleanParser, config) },
      literal: { value: query.spaceDelimited.array(literalParser, config) },
      enumeration: { value: query.spaceDelimited.array(enumParser, config) },
    },
  }
}

export const spaceDelimitedTestParsers: TestDataObject<QueryValueDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
    optional: createTypesParsers({ explode: false, required: false }),
  },
}
