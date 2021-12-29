import { path } from '../index'
import { PathDeserializers, PathOptions } from '../../types'
import {
  enumParser,
  stringParser,
  numberParser,
  booleanParser,
  literalParser,
  optionalObjectFieldParsers,
  objectFieldParsers,
} from '../../value/test/value.testdata'
import { TestDataObject, TypesObject } from '../../testTypes'

function createTypesParsers(config: PathOptions): TypesObject<PathDeserializers<any>> {
  return {
    primitive: {
      string: { value: path.matrix.primitive(stringParser, config) },
      number: { value: path.matrix.primitive(numberParser, config) },
      boolean: { value: path.matrix.primitive(booleanParser, config) },
      literal: { value: path.matrix.primitive(literalParser, config) },
      enumeration: { value: path.matrix.primitive(enumParser, config) },
    },
    array: {
      string: { value: path.matrix.array(stringParser, config) },
      number: { value: path.matrix.array(numberParser, config) },
      boolean: { value: path.matrix.array(booleanParser, config) },
      literal: { value: path.matrix.array(literalParser, config) },
      enumeration: { value: path.matrix.array(enumParser, config) },
    },
    object: {
      optionalFields: { value: path.matrix.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: path.matrix.object(objectFieldParsers, config) },
    },
  }
}

export const matrixTestParsers: TestDataObject<PathDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false }),
  },
}
