import { header } from '../index'
import { HeaderDeserializers, HeaderOptions } from '../../types'
import {
  enumParser,
  stringParser,
  numberParser,
  booleanParser,
  literalParser,
  optionalObjectFieldParsers,
  objectFieldParsers,
} from '../../value/testdata/value.testdata'
import { TestDataObject, TypesObject } from '../../testTypes'

function createTypesParsers(config: HeaderOptions): TypesObject<HeaderDeserializers<any>> {
  return {
    string: { value: header.simple.primitive(stringParser, config) },
    number: { value: header.simple.primitive(numberParser, config) },
    boolean: { value: header.simple.primitive(booleanParser, config) },
    literal: { value: header.simple.primitive(literalParser, config) },
    enumeration: { value: header.simple.primitive(enumParser, config) },
    array: {
      string: { value: header.simple.array(stringParser, config) },
      number: { value: header.simple.array(numberParser, config) },
      boolean: { value: header.simple.array(booleanParser, config) },
      literal: { value: header.simple.array(literalParser, config) },
      enumeration: { value: header.simple.array(enumParser, config) },
    },
    object: {
      optionalFields: { value: header.simple.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: header.simple.object(objectFieldParsers, config) },
    },
  }
}

export const simpleTestParsers: TestDataObject<HeaderDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
    optional: createTypesParsers({ explode: true, required: false }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
    optional: createTypesParsers({ explode: false, required: false }),
  },
}
