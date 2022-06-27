import { query } from '../index'
import { QueryValueDeserializers } from '../../types'
import {
  enumParser,
  stringParser,
  numberParser,
  booleanParser,
  literalParser,
  optionalObjectFieldParsers,
  objectFieldParsers,
} from '../../value/test/valueTestData'
import { TestDataObject, TypesObject } from '../../test/testTypes'
import { DslConfig } from '../../..//types'

function createTypesParsers(config: DslConfig): TypesObject<QueryValueDeserializers<any>> {
  return {
    primitive: {
      string: { value: query.form.primitive(stringParser, config) },
      number: { value: query.form.primitive(numberParser, config) },
      boolean: { value: query.form.primitive(booleanParser, config) },
      literal: { value: query.form.primitive(literalParser, config) },
      enumeration: { value: query.form.primitive(enumParser, config) },
    },
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

export const formTestParsers: TestDataObject<QueryValueDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
    optional: createTypesParsers({ explode: false, required: false }),
  },
}
