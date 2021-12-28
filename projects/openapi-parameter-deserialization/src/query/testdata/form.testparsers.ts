import { query } from '../index'
import { QueryDeserializers, QueryOptions } from '../../types'
import {
  enumParser,
  stringParser,
  numberParser,
  booleanParser,
  literalParser,
  optionalObjectFieldParsers,
  objectFieldParsers,
} from '../../value/value.testdata'
import { TestDataObject, TypesObject } from '../../testTypes'

function createTypesParsers(config: QueryOptions): TypesObject<QueryDeserializers<any>> {
  return {
    string: { value: query.form.primitive(stringParser, config) },
    number: { value: query.form.primitive(numberParser, config) },
    boolean: { value: query.form.primitive(booleanParser, config) },
    literal: { value: query.form.primitive(literalParser, config) },
    enumeration: { value: query.form.primitive(enumParser, config) },
    array: {
      string: { value: query.form.array(stringParser, config) },
      number: { value: query.form.array(numberParser, config) },
      boolean: { value: query.form.array(booleanParser, config) },
      literal: { value: query.form.array(literalParser, config) },
      enumeration: { value: query.form.array(enumParser, config) },
    },
    object: {
      optionalFields: { value: query.form.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: query.form.object(objectFieldParsers, config) },
    },
  }
}

export const formTestParsers: TestDataObject<QueryDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
    optional: createTypesParsers({ explode: false, required: false }),
  },
}
