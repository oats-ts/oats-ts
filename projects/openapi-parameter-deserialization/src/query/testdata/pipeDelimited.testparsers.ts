import { query } from '../index'
import { QueryDeserializers, QueryOptions } from '../../types'
import { enumParser, stringParser, numberParser, booleanParser, literalParser } from '../../value/value.testdata'
import { TestDataObject, TypesObject } from '../../testTypes'

function createTypesParsers(config: QueryOptions): TypesObject<QueryDeserializers<any>> {
  return {
    array: {
      string: { value: query.pipeDelimited.array(stringParser, config) },
      number: { value: query.pipeDelimited.array(numberParser, config) },
      boolean: { value: query.pipeDelimited.array(booleanParser, config) },
      literal: { value: query.pipeDelimited.array(literalParser, config) },
      enumeration: { value: query.pipeDelimited.array(enumParser, config) },
    },
  }
}

export const pipeDelimitedTestParsers: TestDataObject<QueryDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
    optional: createTypesParsers({ explode: false, required: false }),
  },
}
