import { path } from '../index'
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
import { DslConfig, PathDeserializers } from '../../../types'

function createTypesParsers(config: DslConfig): TypesObject<PathDeserializers<any>> {
  return {
    primitive: {
      string: { value: path.simple.primitive(stringParser, config) },
      number: { value: path.simple.primitive(numberParser, config) },
      boolean: { value: path.simple.primitive(booleanParser, config) },
      literal: { value: path.simple.primitive(literalParser, config) },
      enumeration: { value: path.simple.primitive(enumParser, config) },
    },
    array: {
      string: { value: path.simple.array(stringParser, config) },
      number: { value: path.simple.array(numberParser, config) },
      boolean: { value: path.simple.array(booleanParser, config) },
      literal: { value: path.simple.array(literalParser, config) },
      enumeration: { value: path.simple.array(enumParser, config) },
    },
    object: {
      optionalFields: { value: path.simple.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: path.simple.object(objectFieldParsers, config) },
    },
  }
}

export const simpleTestParsers: TestDataObject<PathDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
  },
}
