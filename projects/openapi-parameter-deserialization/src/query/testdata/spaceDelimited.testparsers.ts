import { query } from '../index'
import { QueryDeserializers, QueryOptions } from '../../types'
import { enumParser, stringParser, numberParser, booleanParser, literalParser } from '../../value/value.testdata'
import { TestDataObject, TypesObject } from '../../testTypes'

function createTypesParsers(config: QueryOptions): TypesObject<QueryDeserializers<any>> {
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

export const spaceDelimitedTestParsers: TestDataObject<QueryDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
    optional: createTypesParsers({ explode: false, required: false }),
  },
}
