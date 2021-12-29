import {
  stringParser,
  stringValueData,
  numberValueData,
  numberParser,
  booleanValueData,
  booleanParser,
  literalValueData,
  literalParser,
  enumValueData,
  enumParser,
  optStringValueData,
  optNumberValueData,
  optBooleanValueData,
  optLiteralValueData,
  optEnumValueData,
  optionalStringParser,
  optionalNumberParser,
  optionalBooleanParser,
  optionalLiteralParser,
  optionalEnumParser,
} from './value.testdata'
import { createValueParserTest } from '../value.testutils'

describe('value', () => {
  describe('required', () => {
    createValueParserTest('value.string', stringValueData, stringParser)
    createValueParserTest('value.number', numberValueData, numberParser)
    createValueParserTest('value.boolean', booleanValueData, booleanParser)
    createValueParserTest('value.literal', literalValueData, literalParser)
    createValueParserTest('value.enum', enumValueData, enumParser)
  })
  describe('optional', () => {
    createValueParserTest('value.string (optional)', optStringValueData, optionalStringParser)
    createValueParserTest('value.number (optional)', optNumberValueData, optionalNumberParser)
    createValueParserTest('value.boolean (optional)', optBooleanValueData, optionalBooleanParser)
    createValueParserTest('value.literal (optional)', optLiteralValueData, optionalLiteralParser)
    createValueParserTest('value.enum (optional)', optEnumValueData, optionalEnumParser)
  })
})
