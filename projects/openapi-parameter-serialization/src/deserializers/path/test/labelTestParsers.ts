import { path } from '../index'
import { PathValueDeserializers } from '../../types'
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

function createTypesParsers(config: DslConfig): TypesObject<PathValueDeserializers<any>> {
  return {
    primitive: {
      string: { value: path.label.primitive(stringParser, config) },
      number: { value: path.label.primitive(numberParser, config) },
      boolean: { value: path.label.primitive(booleanParser, config) },
      literal: { value: path.label.primitive(literalParser, config) },
      enumeration: { value: path.label.primitive(enumParser, config) },
    },
    array: {
      string: { value: path.label.array(stringParser, config) },
      number: { value: path.label.array(numberParser, config) },
      boolean: { value: path.label.array(booleanParser, config) },
      literal: { value: path.label.array(literalParser, config) },
      enumeration: { value: path.label.array(enumParser, config) },
    },
    object: {
      optionalFields: { value: path.label.object(optionalObjectFieldParsers, config) },
      requiredFields: { value: path.label.object(objectFieldParsers, config) },
    },
  }
}

export const labelTestParsers: TestDataObject<PathValueDeserializers<any>> = {
  explode: {
    required: createTypesParsers({ explode: true, required: true }),
  },
  noExplode: {
    required: createTypesParsers({ explode: false, required: true }),
  },
}
